<template>
  <div>
    <GeneralInfo />
    <div class="measure">
      <div>
        <router-link id="shareNav" class="button-nav" to="/share">
          Create
        </router-link>
        <router-link id="combineNav" class="button-nav" to="/combine">
          Restore
        </router-link>
        <router-link id="printNav" class="button-nav" to="/print">
          Print
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import GeneralInfo from "../components/GeneralInfo.vue";
import Vue from "vue";

export default Vue.extend({
  name: "Info",
  components: { GeneralInfo },
});
</script>

<style></style>
