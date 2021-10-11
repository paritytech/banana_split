const BASE64 = require("base64-js");
const CRYPTO = require("tweetnacl");
const SCRYPT = require("scryptsy");

const SECRETS = require("secrets.js-grempe");

export type Shard = {
  data: string;
  version: number;
  title: string;
  nonce: string;
  requiredShards: number;
};

type EncryptedData = {
  value: Uint8Array;
  nonce: Uint8Array;
  salt: Uint8Array;
};

const HexEncodeArray = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f"
];

function strToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function uint8ArrayToStr(arr: Uint8Array): string {
  return new TextDecoder("utf-8").decode(arr);
}

function hashString(str: string): Uint8Array {
  return CRYPTO.hash(strToUint8Array(str));
}

function hexify(arr: Uint8Array): string {
  let s = "";
  for (let i = 0; i < arr.length; i++) {
    // `i` is a numerical counter for the loop and is never changed outside of there
    // therefore `i` is numerical, and is safe to use as an array index
    // eslint-disable-next-line security/detect-object-injection
    const code = arr[i];
    s += HexEncodeArray[code >>> 4];
    s += HexEncodeArray[code & 0x0f];
  }
  return s;
}

function dehexify(str: string): Uint8Array {
  const arr = new Uint8Array(str.length / 2);
  for (let i = 0; i < arr.length; i++) {
    // `i` is a numerical counter for the loop and is never changed outside of there
    // therefore `i` is numerical, and is safe to use as an array index
    // eslint-disable-next-line security/detect-object-injection
    arr[i] = parseInt(str.slice(2 * i, 2 * i + 2), 16);
  }
  return arr;
}

function encrypt(
  data: string,
  salt: Uint8Array,
  passphrase: string
): EncryptedData {
  const key = SCRYPT(passphrase, Buffer.from(salt), 1 << 15, 8, 1, 32);
  const nonce = CRYPTO.randomBytes(24);
  return {
    nonce,
    salt,
    value: CRYPTO.secretbox(strToUint8Array(data), nonce, key)
  };
}

function decrypt(
  data: Uint8Array,
  salt: Uint8Array,
  passphrase: string,
  nonce: Uint8Array
): Uint8Array {
  const key = SCRYPT(passphrase, Buffer.from(salt.buffer), 1 << 15, 8, 1, 32);
  // This is a false positive, `secretbox.open` is unrelated to `fs.open`
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return CRYPTO.secretbox.open(data, nonce, key);
}

function share(
  data: string,
  title: string,
  passphrase: string,
  totalShards: number,
  requiredShards: number
): string[] {
  const salt = hashString(title),
    encrypted = encrypt(data, salt, passphrase),
    nonce = BASE64.fromByteArray(encrypted.nonce),
    hexEncrypted = hexify(encrypted.value);
  return SECRETS.share(hexEncrypted, totalShards, requiredShards).map(function(
    shard: string
  ) {
    // First char is non-hex (base36) and signifies the bitfield size of our share
    const encodedShard =
      shard[0] + BASE64.fromByteArray(dehexify(shard.slice(1)));

    return JSON.stringify({
      v: 1,
      t: title,
      r: requiredShards,
      d: encodedShard,
      n: nonce
    }).replace(/[\u007F-\uFFFF]/g, function(chr) {
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    });
  });
}

function parse(payload: string): Shard {
  let parsed = JSON.parse(payload);
  return {
    version: parsed.v || 0, // 'undefined' version is treated as 0
    title: parsed.t,
    requiredShards: parsed.r,
    data: parsed.d,
    nonce: parsed.n
  };
}

function reconstruct(shardObjects: Shard[], passphrase: string): string {
  const shardsRequirements = shardObjects.map(shard => shard.requiredShards);
  if (!shardsRequirements.every(r => r === shardsRequirements[0])) {
    throw "Mismatching min shards requirement among shards!";
  }
  if (shardObjects.length < shardsRequirements[0]) {
    throw `Not enough shards, need ${shardsRequirements[0]} but only ${
      shardObjects.length
    } provided`;
  }

  const nonces = shardObjects.map(shard => shard.nonce);
  if (!nonces.every(n => n === nonces[0])) {
    throw "Nonces mismatch among shards!";
  }

  const titles = shardObjects.map(shard => shard.title);
  if (!titles.every(t => t === titles[0])) {
    throw "Titles mismatch among shards!";
  }

  const versions = shardObjects.map(shard => shard.version);
  if (!versions.every(v => v === versions[0])) {
    throw "Versions mismatch along shards!";
  }

  let decryptedMsg: Uint8Array | null;

  switch (versions[0]) {
    case 0: {
      const shardData = shardObjects.map(shard => shard.data);
      const encryptedSecret = SECRETS.combine(shardData);
      const secret = dehexify(encryptedSecret);
      const nonce = dehexify(nonces[0]);
      const salt = hashString(titles[0]);
      decryptedMsg = decrypt(secret, salt, passphrase, nonce);
      break;
    }
    case 1: {
      const shardDataV1 = shardObjects.map(
        shard => shard.data[0] + hexify(BASE64.toByteArray(shard.data.slice(1)))
      );
      const encryptedSecretV1 = SECRETS.combine(shardDataV1);
      const secretV1 = dehexify(encryptedSecretV1);
      const nonceV1 = BASE64.toByteArray(nonces[0]);
      const saltV1 = hashString(titles[0]);
      decryptedMsg = decrypt(secretV1, saltV1, passphrase, nonceV1);
      break;
    }
    default:
      throw "Version is not supported!";
  }
  if (!decryptedMsg) {
    throw "Unable to decrypt the secret";
  }
  return uint8ArrayToStr(decryptedMsg);
}

export default {
  share,
  parse,
  reconstruct
};
