<template>
  <div id="app">
    <Header />
    <div v-if="secure">
      <Menu />
      <router-view/>
    </div>
    <SavePageInfo v-else-if="!localFile"/>
    <GoOfflineInfo v-else-if="isOnline"/>
  </div>
</template>

<script>
import GoOfflineInfo from './components/GoOfflineInfo'
import SavePageInfo from './components/SavePageInfo'
import Header from './components/Header'
import Menu from './components/Menu'


export default {
  name: 'App',
  components: {
    Header,
    Menu,
    GoOfflineInfo,
    SavePageInfo,
  },
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}

@media print {
  #app {
     display: none;
  }
}
</style>
