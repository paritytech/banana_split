import crypto from "tweetnacl";
import scrypt from "scryptsy";

const HexEncodeArray =  [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
];

export default {
    strToUint8Array: function (str) {
        return new TextEncoder("utf-8").encode(str);
    },
    uint8ArrayToStr: function (arr) {
        return new TextDecoder("utf-8").decode(arr);
    },
    hashString: function (str) {
        return crypto.hash(this.strToUint8Array(str));
    },
    hexify: function (arr) {
        var s = '';
        for (var i = 0; i < arr.length; i++) {
            var code = arr[i];
            s += HexEncodeArray[code >>> 4];
            s += HexEncodeArray[code & 0x0F];
        }
        return s;
    },
    dehexify: function (str) {
        var arr = new Uint8Array(str.length/2);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(str.slice(2*i, 2*i+2), 16);
        }
        return arr;
    },
    encrypt: function (data, salt, passphrase) {
        var key = scrypt(passphrase, salt, 1<<13, 8, 1, 32);
        var nonce = crypto.randomBytes(24);
        return {
            nonce,
            salt,
            value: crypto.secretbox(this.strToUint8Array(data), nonce, key)
        }
    },
    decrypt: function (data, salt, passphrase, nonce) {
        var key = scrypt(passphrase, salt, 1<<13, 8, 1, 32)
        return crypto.secretbox.open(data, nonce, key);
    }
}