const CRYPTO = require("tweetnacl");
const SCRYPT = require("scryptsy");

const SECRETS = require('secrets.js-grempe');

const HexEncodeArray = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
];

function strToUint8Array(str) {
    return new TextEncoder("utf-8").encode(str);
}

function uint8ArrayToStr(arr) {
    return new TextDecoder("utf-8").decode(arr);
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
    var key = SCRYPT(passphrase, salt, 1 << 13, 8, 1, 32);
    var nonce = CRYPTO.randomBytes(24);
    return {
        nonce,
        salt,
        value: CRYPTO.secretbox(strToUint8Array(data), nonce, key)
    }
}

function decrypt(data, salt, passphrase, nonce) {
    var key = SCRYPT(passphrase, salt, 1 << 13, 8, 1, 32);
    return CRYPTO.secretbox.open(data, nonce, key);
}

function share(data, title, passphrase, totalShards, requiredShards) {
    var encrypted = encrypt(data, title, passphrase);
    var nonce = hexify(encrypted.nonce);
    var hexEncrypted = hexify(encrypted.value);
    return SECRETS.share(hexEncrypted, totalShards, requiredShards).map(function (shard) {
        return JSON.stringify({
            t: title,
            r: requiredShards,
            d: shard,
            n: nonce
        });
    });
}

function parse(payload) {
    let parsed = JSON.parse(payload);
    return {
        title: parsed.t,
        requiredShards: parsed.r,
        data: parsed.d,
        nonce: parsed.n
    }
}

function reconstruct(shards, title, passphrase, encodedNonce) {
    var encryptedSecret = SECRETS.combine(shards);
    var secret = dehexify(encryptedSecret);
    var nonce = dehexify(encodedNonce);
    return uint8ArrayToStr(decrypt(secret, title, passphrase, nonce));
}

export default {
    share,
    parse,
    reconstruct
}