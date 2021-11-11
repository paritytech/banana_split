<template>
  <div>
    <div class="card" :transparent="!encryptionMode">
      <h2 class="card-title">
        Create a secret split
      </h2>
      <p>
        <label>1. Name of your split</label>
        <input
          id="secretTitle"
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
          id="secret"
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
        <input
          id="totalShards"
          v-model.number="totalShards"
          :disabled="encryptionMode"
          type="number"
          min="3"
          max="255"
        />
        to reconstruct
      </p>
      <button
        id="generateBtn"
        class="button-card"
        :disabled="secretTooLong"
        :hidden="encryptionMode"
        v-on:click="toggleMode"
      >
        Generate QR codes!
      </button>
      <button
        id="backToEditBtn"
        class="button-card"
        :disabled="secretTooLong"
        :hidden="!encryptionMode"
        v-on:click="toggleMode"
      >
        Back to editing data
      </button>
    </div>

    <div v-if="encryptionMode">
      <div class="card" framed="true" transparent="true">
        <label>4. Your passphrase for the recovery is:</label>
        <div class="flex justify-between align-center">
          <canvas-text :text="recoveryPassphrase" />
          <button class="button-icon" @click="regenPassphrase">
            &#x21ba;
          </button>
        </div>
      </div>
      <div class="card" transparent="true">
        <button id="printBtn" class="button-card" @click="print">
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

<script lang="ts">
import passPhrase from "../util/passPhrase";
import crypto from "../util/crypto";

import ShardInfo from "../components/ShardInfo.vue";
import CanvasText from "../components/CanvasText.vue";
import Vue from "vue";

type ShareData = {
  title: string;
  secret: string;
  totalShards: number;
  recoveryPassphrase: string;
  encryptionMode: boolean;
};

export default Vue.extend({
  name: "Share",
  components: { ShardInfo, CanvasText },
  data(): ShareData {
    return {
      title: "",
      secret: "",
      totalShards: 3, // TODO: 5
      recoveryPassphrase: "",
      encryptionMode: false
    };
  },
  computed: {
    secretTooLong(): boolean {
      return this.secret.length > 1024;
    },
    requiredShards(): number {
      return Math.floor(this.totalShards / 2) + 1;
    },
    shards(): string[] {
      this.$eventHub.$emit("clearAlerts");
      if (!this.encryptionMode) {
        return [];
      }
      try {
        return crypto.share(
          this.secret,
          this.title,
          this.recoveryPassphrase,
          this.totalShards,
          this.requiredShards
        );
      } catch (error) {
        this.$eventHub.$emit("showError", error);
        this.toggleMode(); // back to editing
      }
      return [];
    }
  },
  created: function() {
    this.regenPassphrase();
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
    this.$eventHub.$emit("clearAlerts");
  },
  methods: {
    regenPassphrase: function() {
      if (process.env.NODE_ENV === "test") {
        this.recoveryPassphrase = "TEST";
        return;
      }
      this.recoveryPassphrase = passPhrase.generate(4);
    },
    print: function() {
      window.print();
    },
    toggleMode: function() {
      this.encryptionMode = !this.encryptionMode;
    }
  }
});
</script>

<style>
textarea.tooLong {
  border: 5px solid red;
}
input[type="number"] {
  width: 64px;
  text-align: center;
}
.error-text {
  color: red;
}
</style>
