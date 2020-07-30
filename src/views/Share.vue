<template>
  <div>
    <div id="share-controls">
      <h1>Create a secret split</h1>
      <p>
        Name of your split
        <input
          type="text"
          :disabled="encryptionMode"
          v-model="title"
          placeholder="Ex: 'My Bitcoin seed phrase'"
          autofocus
        />
      </p>
      <textarea
        v-model="secret"
        v-bind:class="{ tooLong: secretTooLong }"
        :disabled="encryptionMode"
        placeholder="Your secret goes here"
      ></textarea>
      <div v-if="this.secretTooLong">
        Inputs longer than 1024 characters make QR codes illegible
      </div>
      <p>
        Will require any {{ requiredShards }} shards out of
        <input type="number" v-model.number="totalShards" min="3" /> to
        reconstruct
      </p>
      <button :disabled="secretTooLong" v-on:click="toggleMode">
        <span v-if="this.encryptionMode">Back to editing data</span>
        <span v-else>Generate QR codes!</span>
      </button>
      <div v-if="this.encryptionMode">
        <p>Your passphrase for the recovery is:</p>
        <p>
          <canvas-text v-bind:text="recoveryPassphrase" />
          <button v-on:click="regenPassphrase">&#x21ba;</button>
        </p>
        <button v-on:click="print">Print us!</button>
      </div>
    </div>

    <div id="qr-tiles">
      <shard-info
        v-for="shard in shards"
        v-bind:key="shard"
        v-bind:shard="shard"
        v-bind:requiredShards="requiredShards"
        v-bind:title="title"
      />
    </div>
  </div>
</template>

<script>
import bipPhrase from "../util/bipPhrase";
import crypto from "../util/crypto";

import ShardInfo from "../components/ShardInfo";
import CanvasText from "../components/CanvasText";

export default {
  name: "Share",
  data: function() {
    return {
      title: "",
      secret: "",
      totalShards: 3, // TODO: 5
      recoveryPassphrase: bipPhrase.generate(4),
      encryptionMode: false
    };
  },
  components: { ShardInfo, CanvasText },
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
  methods: {
    regenPassphrase: function() {
      this.recoveryPassphrase = bipPhrase.generate(4);
    },
    print: function() {
      window.print();
    },
    toggleMode: function() {
      this.encryptionMode = !this.encryptionMode;
    }
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
  }
};
</script>

<style>
textarea.tooLong {
  border: 5px solid red;
}

#share-controls {
  width: 320px;
  margin: 0 auto;
  text-align: left;
}

#qr-tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
input[type="text"],
textarea {
  width: 320px;
  display: block;
}

input,
textarea {
  background: #eee;
  border: 0;
  padding: 10px 5px;
  border-radius: 3px;
  font-size: 1em;
  font-weight: 600;
  font-family: Avenir, Avenir next, Helvetica, Arial;
}

input:disabled,
textarea:disabled {
  opacity: 0.5;
  color: #99928f;
}

input[type="number"] {
  width: 48px;
  text-align: center;
}

textarea {
  min-height: 80px;
}
@media screen {
  #qr-tiles {
    width: calc(70%);
    margin-left: calc(15%);
    flex-direction: row;
  }
}
</style>
