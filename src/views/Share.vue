<template>
  <div>
    <div class="card" :alt="!encryptionMode">
      <h2 class="card-title">
        Create a secret split
      </h2>
      <p>
        <label>1. Name of your split</label>
        <input
          v-model="title"
          type="text"
          :disabled="encryptionMode"
          placeholder="Ex: 'My Bitcoin seed phrase'"
          autofocus
        />
      </p>
      <p>
        <label>2. Secret</label>
        <textarea
          v-model="secret"
          :class="{ tooLong: secretTooLong }"
          :disabled="encryptionMode"
          placeholder="Your secret goes here"
        />
        <span v-if="secretTooLong" class="error-text">
          Inputs longer than 1024 characters make QR codes illegible
        </span>
      </p>
      <p>
        <label>3. Shards</label>
        <br />
        Will require any {{ requiredShards }} shards out of
        <input v-model.number="totalShards" type="number" min="3" /> to
        reconstruct
      </p>
      <button
        class="button-card"
        :disabled="secretTooLong"
        v-on:click="toggleMode"
      >
        <span v-if="encryptionMode">Back to editing data</span>
        <span v-else>Generate QR codes!</span>
      </button>
    </div>

    <div v-if="encryptionMode">
      <div class="card" framed="true" alt="true">
        <label>4. Your passphrase for the recovery is:</label>
        <div class="flex justify-between align-center">
          <canvas-text :text="recoveryPassphrase" />
          <button class="button-icon" @click="regenPassphrase">
            &#x21ba;
          </button>
        </div>
      </div>
      <div class="card" alt="true">
        <button class="button-card" @click="print">
          Print us!
        </button>
        <shard-info
          v-for="shard in shards"
          :key="shard"
          :shard="shard"
          :required-shards="requiredShards"
          :title="title"
        />
      </div>
    </div>
  </div>
</template>

<script>
import passPhrase from "../util/passPhrase";
import crypto from "../util/crypto";

import ShardInfo from "../components/ShardInfo";
import CanvasText from "../components/CanvasText";

export default {
  name: "Share",
  components: { ShardInfo, CanvasText },
  data: function() {
    return {
      title: "",
      secret: "",
      totalShards: 3, // TODO: 5
      recoveryPassphrase: passPhrase.generate(4),
      encryptionMode: false
    };
  },
  computed: {
    secretTooLong: function() {
      return this.secret.length > 1024;
    },
    requiredShards: function() {
      return Math.floor(this.totalShards / 2) + 1;
    },
    shards: function() {
      if (!this.encryptionMode) {
        return [];
      }
      return crypto.share(
        this.secret,
        this.title,
        this.recoveryPassphrase,
        this.totalShards,
        this.requiredShards
      );
    }
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
  },
  methods: {
    regenPassphrase: function() {
      this.recoveryPassphrase = passPhrase.generate(4);
    },
    print: function() {
      window.print();
    },
    toggleMode: function() {
      this.encryptionMode = !this.encryptionMode;
    }
  }
};
</script>

<style>
textarea.tooLong {
  border: 5px solid red;
}
input[type="number"] {
  width: 48px;
  text-align: center;
}
.error-text {
  color: red;
}
</style>
