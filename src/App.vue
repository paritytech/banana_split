<template>
  <div id="app">
    <div v-if="secure">
      <router-view/>
      <nav>
        <router-link to="/share">Share</router-link> |
        <router-link to="/combine">Combine</router-link>
      </nav>
    </div>
    <div v-else-if="!localFile">
      <h1>Please save this page to your local drive before use</h1>
      <div>
        Just save this html file (with Ctrl+S or from your browser's save menu) to a folder on your hard drive,
        and then open (double-click) that file from there.
        </div>
    </div>
    <div v-else-if="isOnline">
      <h1>Please go offline, so your secrets won't leak accidentally</h1>
      <div>
        <p>This application doesn't require Internet access, and you shouldn't be using it from a brower which has one.</p>
        <p>It's really trivial to accidentally upload your unencrypted secrets somewhere, with a help of your browser spellchecker, webpage trnslation extension and such.</p>
        <p>In Firefox, please go to Menu→More→Work Offline.</p>
        <p>In Chrome, you'll have to open DevTools (Ctrl+Shift+I), then in the Network tab there check the "Offline" checkbox. (DON'T CLOSE DEVELOPER TOOLS AFTER THAT!)</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'App',
    computed: {
        localFile: function() {
          return (window.location.protocol === 'file:');
        },
        secure: function() {
          if (process.env.NODE_ENV === 'production') {
            return this.localFile && !this.isOnline;
          } else {
            return true
          }
        }
    }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
  text-decoration: none;
}

@media print {
  #app {
     display: none;
  }
}
</style>
