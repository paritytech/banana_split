<template>
  <div>
    <div id="share-controls">
      <h1>Create a secret split</h1>
      <p>
        Name of your split
        <input
          v-model="title"
          type="text"
          :disabled="encryptionMode"
          placeholder="Ex: 'My Bitcoin seed phrase'"
          autofocus
        />
      </p>
      <textarea
        v-model="secret"
        :class="{ tooLong: secretTooLong }"
        :disabled="encryptionMode"
        placeholder="Your secret goes here"
      />
      <div v-if="secretTooLong">
        Inputs longer than 1024 characters make QR codes illegible
      </div>
      <p>
        Will require any {{ requiredShards }} shards out of
        <input v-model.number="totalShards" type="number" min="3" /> to
        reconstruct
      </p>
      <button :disabled="secretTooLong" v-on:click="toggleMode">
        <span v-if="encryptionMode">Back to editing data</span>
        <span v-else>Generate QR codes!</span>
      </button>
      <div v-if="encryptionMode">
        <p>Your passphrase for the recovery is:</p>
        <p>
          <canvas-text :text="recoveryPassphrase" />
          <button @click="regenPassphrase">
            &#x21ba;
          </button>
        </p>
        <button @click="print">
          Print us!
        </button>
      </div>
    </div>

    <div id="qr-tiles">
      <shard-info
        v-for="shard in shards"
        :key="shard"
        :shard="shard"
        :required-shards="requiredShards"
        :title="title"
      />
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
      this.recoveryPassphrase = bipPhrase.generate(4);
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
