<template>
  <div>
    <h1>
      Combine shards for <em v-if="title"> {{ title }}</em>
    </h1>
    <div v-if="needMoreShards">
      <qrcode-stream v-on:decode="onDecode" />
      <div class="codes-row">
        <qriously
          class="qrcode"
          v-for="code in qrCodes"
          v-bind:key="code"
          v-bind:value="code"
          v-bind:size="200"
          v-bind:padding="0"
        />
        <qriously
          class="qrcode remaining"
          v-for="n in remainingCodes"
          v-bind:key="n"
          value='{"t":"Very secret info","r":2,"d":"803c12929ba469d720a63fc8ca6f6ef1cc441f8f0b830ea04f8a484169ec800e4a7","n":"29abbb2c509adedb470f6d3fd3d083362b8c1a9283adf987"}'
          v-bind:size="200"
          foreground="#aaa"
          v-bind:padding="0"
        />
      </div>
    </div>
    <div v-else>
      <input
        type="text"
        v-model="passphrase"
        v-on:keyup.enter="reconstruct"
        placeholder="type your passphrase"
        autofocus
      />
      <button v-on:click="reconstruct">Reconstruct Secret</button>
    </div>
    <h2 class="secret" v-if="recoveredSecret">{{ recoveredSecret }}</h2>
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
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
  }
};
</script>

<style>
@keyframes unblur {
  0% {
    filter: blur(5px) brightness(200%);
  }

  100% {
    filter: none;
  }
}
.codes-row {
  display: flex;
  padding: 20px;
}

.qrcode {
  display: inline-block;
  padding: 10px;
  flex: 1;
  animation: unblur 1s ease;
}

.qrcode.remaining {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  opacity: 0.5;
  animation: none;
}

input {
  margin: 0 auto;
}

canvas {
  margin: 0;
  padding: 0;
  width: 100%;
}

.secret {
  padding: 20px 20px 40px;
  margin: 20px;
  word-wrap: break-word;
  background: #fff;
  border-radius: 3px;
  box-shadow: #dadada 0 2px 43px;
}
/* Flip video to make it easier to use */
.qrcode-stream {
  transform: scaleX(-1);
}
</style>
