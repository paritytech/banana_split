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

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function base64toHex(base64) {
    return window.atob(base64)
        .split('')
        .map(function (aChar) {
            return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
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
    var salt = hashString(title);
    var encrypted = encrypt(data, salt, passphrase);
    var nonce = hexify(encrypted.nonce);
    var hexEncrypted = hexify(encrypted.value);
    return SECRETS.share(hexEncrypted, totalShards, requiredShards).map(function (shard) {
        return JSON.stringify({
            t: title,
            r: requiredShards,
            d: shard,
            n: nonce
        }).replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
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
    var salt = hashString(title);
    return uint8ArrayToStr(decrypt(secret, salt, passphrase, nonce));
}

export default {
    share,
    parse,
    reconstruct
}