<template>
  <div class="card warning">
    <h2>Please go offline, so your secrets won't leak accidentally</h2>
    <p>
      This application doesn't require Internet access, and you shouldn't be
      using it from a browser which has one.
    </p>
    <p>
      It's really trivial to accidentally upload your unencrypted secrets
      somewhere, with a help of your browser spellchecker, webpage translation
      extension and such.
    </p>
    <p>
      Just disable your WiFi in your device settings and unplug any network
      related cables if applicable.
    </p>
  </div>
</template>

<script lang="ts">
export default {
  name: "GoOfflineInfo"
};
</script>

<style>
.warning {
  background: #ffbbb3;
  border: solid #e87f73 7px;
}
</style>
