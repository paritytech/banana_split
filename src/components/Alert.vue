<template>
  <div v-if="message" class="alert measure" :class="level">
    <p class="alert__text">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// This is a false positive. Suppress eslint error.
/* eslint-disable no-unused-vars */
enum AlertLevel {
  Error = "error",
  Warn = "warn"
}
/* eslint-enable no-unused-vars */

type AlertData = {
  message: string | null;
  level: AlertLevel;
};

export default Vue.extend({
  name: "Alert",
  data: function(): AlertData {
    return {
      message: null,
      level: AlertLevel.Error
    };
  },
  created: function() {
    this.$eventHub.$on("showError", (text: string) => {
      this.level = AlertLevel.Error;
      this.message = text;
    });
    this.$eventHub.$on("showWarn", (text: string) => {
      this.level = AlertLevel.Warn;
      this.message = text;
    });
    this.$eventHub.$on("clearAlerts", () => {
      this.message = null;
    });
  }
});
</script>

<style>
.alert {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid;
}
.alert.warn {
  border-color: #e8b173;
  background-color: #ffe7b3;
  color: #8b6400;
}
.alert.error {
  border-color: #e87f73;
  background-color: #ffbbb3;
  color: darkred;
}
.alert__text {
  margin: 0;
  width: 100%;
}
</style>
