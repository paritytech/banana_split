<template>
  <header>
    <h1>Banana Split</h1>
    <div class="slogan">Make paper backups more resilient and secure</div>
    <ForkMe
        v-if="!IS_ELECTRON_BUILD"
        url="https://github.com/paritytech/banana_split"/>
  </header>
</template>

<script>
  import ForkMe from './ForkMe'

  export default {
    name: 'Header',
    components: {
      ForkMe
    }
  }
</script>

<style>
  header {
    color: grey;
  }
  h1 {
    margin: 0;
    font-weight: bold;
  }
  .slogan {
    font-size: small;

  }
</style>
