<template>
  <div class="warning card">
    <h2>Please save this page to your local drive before use</h2>
    <p>
      Please <a href="." download="BananaSplit.html">save this html file</a> to
      a folder on your local drive, and then open the file from there.
    </p>
  </div>
</template>

<script>
export default {
  name: "SavePageInfo"
};
</script>

<style>
.card.warning {
  background: #ffbbb3;
  border: solid #e87f73 7px;
}
</style>
