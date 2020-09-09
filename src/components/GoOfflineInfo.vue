<template>
  <div class="card warning">
    <h2>Please go offline, so your secrets won't leak accidentally</h2>
    <p>
      This application doesn't require Internet access, and you shouldn't be
      using it from a brower which has one.
    </p>
    <p>
      It's really trivial to accidentally upload your unencrypted secrets
      somewhere, with a help of your browser spellchecker, webpage translation
      extension and such.
    </p>
    <p>In Firefox, please go to Menu→More→Work Offline.</p>
    <p>
      In Chrome, you'll have to open DevTools (Ctrl+Shift+I), then in the
      Network tab there check the "Offline" checkbox. (DON'T CLOSE DEVELOPER
      TOOLS AFTER THAT!)
    </p>
  </div>
</template>

<script>
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
