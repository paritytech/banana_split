import crypto from "tweetnacl";
import scrypt from "scryptsy";

const HexEncodeArray =  [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
];

export default {
    strToUint8Array: function (str) {
        var uint=new Uint8Array(str.length);
        for(var i=0,j=str.length;i<j;++i){
            uint[i]=str.charCodeAt(i);
        }
        return uint;
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
    encrypt: function (data, salt, passphrase) {
        var key = scrypt(passphrase, salt, 1<<13, 8, 1, 32);
        var nonce = crypto.randomBytes(24);
        return {
            nonce,
            salt,
            value: crypto.secretbox(this.strToUint8Array(data), nonce, key)
        }
    }
}