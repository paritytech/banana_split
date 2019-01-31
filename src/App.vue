<template>
  <div id="app">
    <GeneralInfo/>
    <div v-if="secure">
      <router-view/>
      <nav>
        <router-link to="/share">Share</router-link> |
        <router-link to="/combine">Combine</router-link>
      </nav>
    </div>
    <SavePageInfo v-else-if="!localFile"/>
    <GoOfflineInfo v-else-if="isOnline"/>
  </div>
</template>

<script>
import GeneralInfo from './components/GeneralInfo'
import GoOfflineInfo from './components/GoOfflineInfo'
import SavePageInfo from './components/SavePageInfo'

export default {
  name: 'App',
  components: {GeneralInfo, GoOfflineInfo, SavePageInfo},
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
