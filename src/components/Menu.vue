<template>
  <nav>
    <router-link to="/">Get started</router-link>
    <router-link to="/share">Share</router-link>
    <router-link to="/combine">Combine</router-link>
  </nav>
</template>

<script>

  export default {
    name: 'Menu',
    components: {
    }
  }
</script>

<style>
  nav {
    margin: 30px 0;
  }

  nav a {
    color: ButtonText;
    background: ButtonHighlight;
    text-decoration: none;
    display: inline-block;
    padding: .2em .7em;
    border: 1px solid ActiveBorder;
  }
  nav a:first-child {
    border-right: 0;
    border-bottom-left-radius: .45em;
    border-top-left-radius: .45em;
  }
  nav a:last-child {
    border-left: 0;
    border-bottom-right-radius: .45em;
    border-top-right-radius: .45em;
  }
  nav a.router-link-exact-active {
    background: Highlight;
    color: HighlightText;
  }
</style>
