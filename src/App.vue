<template>
  <div id="app">
    <router-view v-if="secure"/>
    <div v-else>
      <ul id="security-checklist">
        <ChecklistItem v-bind:checked="localFile">Serve from local filesystem</ChecklistItem> 
        <ChecklistItem v-bind:checked="!isOnline">Go offline</ChecklistItem> 
      </ul>
    </div>
  </div>
</template>

<script>
import ChecklistItem from '@/components/ChecklistItem.vue';
export default {
    name: 'App',
    components: {
        ChecklistItem
    },
    computed: {
        localFile: function() {
            return (window.location.protocol === 'file:');
        },
        secure: function() {
          return this.localFile && !this.isOnline;
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
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
