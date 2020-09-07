<template>
  <div>

    <div class="card measure" :alt="!recoveredSecret">
      <h2 class="card-title">
        Combine shards <span v-if="title"> for <em v-if="title"> {{ title }}</em></span>
      </h2>
      <div v-if="needMoreShards">
        <qrcode-stream @decode="onDecode" />
      </div>
      <div v-else>
        <p>
          <label>1. Secret Phrase</label>
          <input
            v-model="passphrase"
            type="text"
            placeholder="type your passphrase"
            autofocus
            @keyup.enter="reconstruct"
          />
        </p>
        <p>
          <label>2. Secret</label>
          <textarea v-if="recoveredSecret" readonly>{{ recoveredSecret }}</textarea>
          <textarea v-else readonly disabled/>
        </p>
        <div v-if="!recoveredSecret">
          <button class="button-card" @click="reconstruct">
            Reconstruct Secret
          </button>
        </div>
      </div>
    </div>

     <div class="card flex" alt="true" :framed="recoveredSecret && true">
        <qriously
          v-for="code in qrCodes"
          :key="code"
          class="card-qr"
          :value="code"
          :size="200"
        />
        <qriously
          v-for="n in remainingCodes"
          :key="n"
          class="remaining card-qr"
          :value="PLACEHOLDER_QR_DATA"
          :size="200"
        />
      </div>
      
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

import crypto from "../util/crypto";

export default {
  name: "Combine",
  data: function() {
    return {
      title: "",
      nonce: "",
      shards: new Set(),
      qrCodes: [],
      requiredShards: undefined,
      passphrase: "",
      recoveredSecret: undefined
    };
  },
  computed: {
    needMoreShards: function() {
      return !this.requiredShards || this.qrCodes.length < this.requiredShards;
    },
    remainingCodes: function() {
      if (!this.requiredShards) {
        return 0;
      } else {
        return this.requiredShards - this.qrCodes.length;
      }
    }
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
  },
  methods: {
    onDecode: function(result) {
      var parsed = crypto.parse(result);
      if (!this.shards.has(parsed.data)) {
        if (this.title && this.title != parsed.title) {
          console.error("title mismatch!");
          return;
        } else {
          this.title = parsed.title;
        }
        if (this.nonce && this.nonce != parsed.nonce) {
          console.error("nonce mismatch!");
          return;
        } else {
          this.nonce = parsed.nonce;
        }
        if (
          this.requiredShards &&
          this.requiredShards != parsed.requiredShards
        ) {
          console.error("requiredShards mismatch");
          return;
        } else {
          this.requiredShards = parsed.requiredShards;
        }
        this.qrCodes.push(result);
        this.shards.add(parsed);
      } else {
        console.warn("Shard already seen");
      }
    },
    reconstruct: function() {
      if (!this.passphrase) {
        return;
      }
      this.passphrase = this.passphrase
        .split(" ")
        .filter(el => el)
        .join("-");
      var shards = Array.from(this.shards);
      this.recoveredSecret = crypto.reconstruct(shards, this.passphrase);
    }
  }
};
</script>

<style>
.remaining {
  filter: blur(5px);
  opacity: 0.5;
}
/* Flip video to make it easier to use */
.qrcode-stream {
  transform: scaleX(-1);
  border-radius: 8px;
  overflow: hidden;
}
</style>
