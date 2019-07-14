const CRYPTO = require("tweetnacl");
const SCRYPT = require("scryptsy");

const SECRETS = require('secrets.js-grempe');

const PROTOBUF = require("protobufjs/light");

const ShardMessage = function(){
    var root = new PROTOBUF.Root().define("bananasplitv1");
    var ShardData = new PROTOBUF.Type("ShardData")
        .add(new PROTOBUF.Field("bits", 1, "uint32"))
        .add(new PROTOBUF.Field("id", 2, "uint32"))
        .add(new PROTOBUF.Field("data", 3, "bytes"));
    root.add(ShardData);

    var ShardMessage = new PROTOBUF.Type("ShardMessage")
        .add(new PROTOBUF.Field("version", 1, "uint32"))
        .add(new PROTOBUF.Field("title", 2, "string"))
        .add(new PROTOBUF.Field("requiredShards", 3, "uint32"))
        .add(new PROTOBUF.Field("nonce", 4, "bytes"))
        .add(new PROTOBUF.Field("data", 5, "ShardData"));
    root.add(ShardMessage);

    return root.resolveAll().lookupType("bananasplitv1.ShardMessage")
}();

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
    return SECRETS.share(hexify(encrypted.value), totalShards, requiredShards).map(function (hexShard) {
        var shard = SECRETS.extractShareComponents(hexShard);
        shard.data = dehexify(shard.data);

        var shardMessage = ShardMessage.create({ version: 1, title, requiredShards, nonce: encrypted.nonce, data: shard });
        return ShardMessage.encode(shardMessage).finish();
    });
}

function parse(payload) {
    if (payload[0] === '{') { // Old version was using JSON encoding, this is a naïve check for JSON
        let parsed = JSON.parse(payload);
        return {
            version: 0,
            title: parsed.t,
            requiredShards: parsed.r,
            data: parsed.d,
            nonce: parsed.n
        }
    } else {
        return ShardMessage.decode(payload);
    }
}

function reconstruct(shardObjects, passphrase) {
    // compare TypedArrays
    function typedArraysAreEqual(a, b) {
        if (a.byteLength !== b.byteLength) return false;
        return a.every((val, i) => val === b[i]);
    }

    var shardsRequirements = shardObjects.map(shard => shard.requiredShards);
    if (!shardsRequirements.every(r => r===shardsRequirements[0])) {
        throw "Mismatching min shards requirement among shards!"
    }
    if (shardObjects.length < shardsRequirements[0]) {
        throw `Not enough shards, need ${shardsRequirements[0]} but only ${shardObjects.length} provided`
    }

    var nonces = shardObjects.map(shard => shard.nonce);
    if (!nonces.every(n => n===nonces[0] || typedArraysAreEqual(n, nonces[0]))) {
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
            var shardDataV1 = shardObjects.map(shard => {
                // Directly extracted from secrets.js code because it's stupid and cannot consume raw buffers

                function padLeft(str, multipleOfBits) {
                    var missing = str.length % multipleOfBits;
                    return (new Array(1024).join("0") + str).slice(-(multipleOfBits - missing + str.length));
                }

                var bitsBase36 = shard.data.bits.toString(36).toUpperCase();
                var idMax = Math.pow(2, shard.data.bits) - 1;
                var idPaddingLen = idMax.toString(16).length;
                var idHex = padLeft(shard.data.id.toString(16), idPaddingLen);

                return bitsBase36 + idHex + hexify(shard.data.data)
            });
            var encryptedSecretV1 = SECRETS.combine(shardDataV1);
            var secretV1 = dehexify(encryptedSecretV1);
            var nonceV1 = nonces[0];
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

