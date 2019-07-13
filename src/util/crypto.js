const BASE64 = require("base64-js");
const CRYPTO = require("tweetnacl");
const SCRYPT = require("scryptsy");

const SECRETS = require('secrets.js-grempe');

const HexEncodeArray = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
];

function strToUint8Array(str) {
    return new TextEncoder("utf-8").encode(str);
}

function uint8ArrayToStr(arr) {
    return new TextDecoder("utf-8").decode(arr);
}

function hashString(str) {
    return CRYPTO.hash(strToUint8Array(str));
}

function hexify(arr) {
    var s = '';
    for (var i = 0; i < arr.length; i++) {
        var code = arr[i];
        s += HexEncodeArray[code >>> 4];
        s += HexEncodeArray[code & 0x0F];
    }
    return s;
}

function dehexify(str) {
    var arr = new Uint8Array(str.length / 2);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(str.slice(2 * i, 2 * i + 2), 16);
    }
    return arr;
}

function encrypt(data, salt, passphrase) {
    var key = SCRYPT(passphrase, Buffer.from(salt), 1 << 15, 8, 1, 32);
    var nonce = CRYPTO.randomBytes(24);
    return {
        nonce,
        salt,
        value: CRYPTO.secretbox(strToUint8Array(data), nonce, key)
    }
}

function decrypt(data, salt, passphrase, nonce) {
    var key = SCRYPT(passphrase, Buffer.from(salt.buffer), 1 << 15, 8, 1, 32);
    return CRYPTO.secretbox.open(data, nonce, key);
}

function share(data, title, passphrase, totalShards, requiredShards) {
    var salt = hashString(title);
    var encrypted = encrypt(data, salt, passphrase);
    var nonce = BASE64.fromByteArray(encrypted.nonce);
    var hexEncrypted = hexify(encrypted.value);
    return SECRETS.share(hexEncrypted, totalShards, requiredShards).map(function (shard) {
        return JSON.stringify({
            v: 1,
            t: title,
            r: requiredShards,
            d: BASE64.fromByteArray(dehexify(shard)),
            n: nonce
        }).replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
    });
}

function parse(payload) {
    let parsed = JSON.parse(payload);
    return {
        version: parsed.v || 0, // 'undefined' version is treated as 0
        title: parsed.t,
        requiredShards: parsed.r,
        data: parsed.d,
        nonce: parsed.n
    }
}

function reconstruct(shardObjects, passphrase) {
    var shardsRequirements = shardObjects.map(shard => shard.requiredShards);
    if (!shardsRequirements.every(r => r===shardsRequirements[0])) {
        throw "Mismatching min shards requirement among shards!"
    }
    if (shardObjects.length < shardsRequirements[0]) {
        throw `Not enough shards, need ${shardsRequirements[0]} but only ${shardObjects.length} provided`
    }

    var nonces = shardObjects.map(shard => shard.nonce);
    if (!nonces.every(n => n===nonces[0])) {
        throw "Nonces mismatch among shards!"
    }

    var titles = shardObjects.map((shard) => shard.title);
    if (!titles.every(t => t===titles[0])) {
        throw "Titles mismatch among shards!"
    }

    var versions = shardObjects.map(shard => shard.version);
    if  (!versions.every(v => v===versions[0])) {
        throw "Versions mismatch along shards!"
    }

    switch (versions[0]) {
        case 0:
            var shardData = shardObjects.map(shard => shard.data);
            var encryptedSecret = SECRETS.combine(shardData);
            var secret = dehexify(encryptedSecret);
            var nonce = dehexify(nonces[0]);
            var salt = hashString(titles[0]);
            return uint8ArrayToStr(decrypt(secret, salt, passphrase, nonce));

        case 1:
            var shardDataV1 = shardObjects.map(shard => hexify(BASE64.toByteArray(shard.data)));
            var encryptedSecretV1 = SECRETS.combine(shardDataV1);
            var secretV1 = dehexify(encryptedSecretV1);
            var nonceV1 = BASE64.toByteArray(nonces[0]);
            var saltV1 = hashString(titles[0]);
            return uint8ArrayToStr(decrypt(secretV1, saltV1, passphrase, nonceV1));

        default:
            throw "Version is not supported!";
    }
}

export default {
    share,
    parse,
    reconstruct
}

