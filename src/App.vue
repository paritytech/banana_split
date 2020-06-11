<template>
  <div id="app">
    <ForkMe url="https://github.com/paritytech/banana_split" />
    <GeneralInfo />
    <div v-if="secure">
      <router-view />
      <nav>
        <router-link to="/share">Create</router-link>
        <router-link to="/combine">Restore </router-link>
      </nav>
    </div>
    <SavePageInfo v-else-if="!localFile" />
    <GoOfflineInfo v-else-if="isOnline" />
    <p class="version-footer">
      BananaSplit version {{ version }}, git revision {{ gitRevision }}
    </p>
  </div>
</template>

<script>
import GeneralInfo from "./components/GeneralInfo";
import GoOfflineInfo from "./components/GoOfflineInfo";
import SavePageInfo from "./components/SavePageInfo";
import ForkMe from "./components/ForkMe";

import { version } from "../package.json";

export default {
  name: "App",
  components: { GeneralInfo, GoOfflineInfo, SavePageInfo, ForkMe },
  computed: {
    localFile: function() {
      return window.location.protocol === "file:";
    },
    secure: function() {
      if (process.env.NODE_ENV === "production") {
        return this.localFile && !this.isOnline;
      } else {
        return true;
      }
    },
    version: function() {
      return version;
    },
    gitRevision: function() {
      return process.env.GIT_REVISION;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  color: #49494b;
  background: #ebe8e3;
}
#app {
  font-family: "Avenir Next Condensed", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  padding: 0 0 200px 0;
}

nav {
  padding: 20px;
  background: linear-gradient(rgba(235, 232, 226, 0), #ebe8e3);
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

h1 {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1.5em;
}

nav a {
  font-weight: 600;
  font-size: 1.5em;
  color: #49494b;
  border: 2px solid #49494b;
  padding: 10px 20px;
  flex: 1;
  text-transform: uppercase;
  text-decoration: none;
  background: #ebe8e3;
}

nav a:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right-width: 1px;
}

nav a:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-left-width: 1px;
}

nav a.router-link-exact-active {
  background: #49494b;
  color: #ebe8e3;
}

button {
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 5px;
  font-family: "Avenir Next Condensed", "Avenir", Helvetica, Arial, sans-serif;
  font-weight: 600;
  font-size: 1.5em;
  text-transform: uppercase;
  background: #49494b;
  color: #ebe8e3;
}

canvas {
  /* border: 2px solid #49494b; */
  /* padding: 20px; */
  margin: 10px 0;
  border-radius: 5px;
}

@media print {
  #app {
    display: none;
  }
}

.version-footer {
  font-size: 80%;
  font-style: italic;
  color: darkgray;
}
</style>
