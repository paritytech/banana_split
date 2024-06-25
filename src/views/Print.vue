<template>
  <div>
    <div class="card measure" :transparent="needMoreShards">
      <h2 class="card-title">
        Print shards
        <div v-if="!numberEntered">
          <p>
            <label>Shards</label>
            <br />
            How many shards have you generated?
            <br>
            <input
              id="totalShards"
              v-model.number="requiredShards"
              type="number"
              min="3"
              max="255"
            />
          </p>
          <button id="generateBtn" class="button-card" @click="handleShardsInput">
            Import QR codes!
          </button>
        </div>
        <span v-if="title">
          for <em v-if="title"> {{ title }}</em>
        </span>
      </h2>
      <div v-if="numberEntered && needMoreShards">
        <qrcode-stream @decode="onDecode" />
      </div>
      <div v-else-if="numberEntered">
        <button id="printBtn" class="button-card" @click="print">
          Print us!
        </button>
        <shard-info
          v-for="code in qrCodes"
          :key="code"
          :shard="code"
          :required-shards="parseInt(requiredShards/2)+2"
          :title="title"
        />
      </div>
    </div>
    <div v-if="numberEntered && needMoreShards">
      <div class="card flex" transparent="true">
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
  </div>
</template>

<script lang="ts">
import crypto, { Shard } from "../util/crypto";
import ShardInfo from "../components/ShardInfo.vue";

import Vue from "vue";

type PrintData = {
  title: string;
  nonce: string;
  shards: Shard[];
  qrCodes: Set<string>;
  requiredShards?: number;
  numberEntered: boolean;
  PLACEHOLDER_QR_DATA: string;
};

export default Vue.extend({
  name: "Print",
  components: { ShardInfo },
  data(): PrintData {
    return {
      title: "",
      nonce: "",
      shards: [],
      qrCodes: new Set(),
      requiredShards: undefined,
      numberEntered: false,
      PLACEHOLDER_QR_DATA: ""
    };
  },
  computed: {
    needMoreShards(): boolean {
      return this.requiredShards !== undefined && this.shards.length !== this.requiredShards;
    },
    remainingCodes(): number {
      if (!this.requiredShards) {
        return 0;
      } else {
        return this.requiredShards - this.shards.length;
      }
    }
  },
  mounted: function() {
    this.$eventHub.$emit("foldGeneralInfo");
    this.$eventHub.$emit("clearAlerts");
  },
  methods: {
    onDecode: function(result: string): string | void {
      this.$eventHub.$emit("clearAlerts");
      if (result === "") {
        return;
      }
      if (this.qrCodes.has(result)) {
        return;
      }
      let parsed;
      try {
        parsed = crypto.parse(result);
      } catch (error) {
        this.$eventHub.$emit("showError", error);
        return;
      }

      if (this.title && this.title !== parsed.title) {
        this.$eventHub.$emit("showError", "title mismatch!");
        return;
      } else {
        this.title = parsed.title;
      }
      if (this.nonce && this.nonce !== parsed.nonce) {
        this.$eventHub.$emit("showError", "nonce mismatch!");
        return;
      } else {
        this.nonce = parsed.nonce;
      }
      this.qrCodes.add(result);
      this.shards.push(parsed);
    },
    print: function() {
      window.print();
    },
    handleShardsInput: function() {
      if (this.requiredShards && this.requiredShards >= 3 && this.requiredShards <= 255) {
        this.numberEntered = true;
      } else {
        this.$eventHub.$emit("showError", "Please enter a valid number of shards between 3 and 255.");
      }
    },
    toggleMode: function() {
      this.numberEntered = !this.numberEntered;
    }
  }
});
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
