<template>
  <div>
    <div id="app" class="measure">
      <ForkMe url="https://github.com/paritytech/banana_split" />
      <nav>
        <router-link id="logo" to="/">
          <span class="logo-text">
            Banana Split
          </span>
          <span class="logo-icon">
            🍌
          </span>
        </router-link>
        <Alert />
      </nav>

      <router-view v-if="secure" />
      <SavePageInfo v-else-if="!localFile" />
      <GoOfflineInfo v-else-if="isOnline" />
      <div class="version-footer">
        BananaSplit version {{ version }}, git revision {{ gitRevision }}
      </div>
    </div>
    <div id="print" class="measure flex" />
  </div>
</template>

<script lang="ts">
import Alert from "./components/Alert.vue";
import GoOfflineInfo from "./components/GoOfflineInfo.vue";
import SavePageInfo from "./components/SavePageInfo.vue";
import ForkMe from "./components/ForkMe.vue";

import { version } from "../package.json";
import Vue from "vue";

export default Vue.extend({
  name: "App",
  components: { Alert, GoOfflineInfo, SavePageInfo, ForkMe },
  computed: {
    localFile(): boolean {
      return window.location.protocol === "file:";
    },
    secure(): boolean {
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
});
</script>

<style>
:root {
  --c_bg-app: #f2f1f0;
  --c_bg-card: #fff;
  --c_bg-emphasis-main: #353535;
  --c_bg-emphasis-dark: #000;
  --c_border-main: #d6d6d6;
  --c_border-light: #ebebeb;
  --c_text-main: #222;
  --c_text-secondary: #606060;
  --c_text-onEmphasis: #fff;
  --c_accent: #ff1864;
  --w_app: 620px;
  --f_main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
* {
  box-sizing: border-box;
}
html {
  font-family: var(--f_main);
  font-size: 9px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 2rem 0;
  color: var(--c_text-main);
  background: var(--c_bg-app);
  font-size: 1.8rem;
}
.measure {
  width: var(--w_app);
  max-width: calc(100vw - 2rem);
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}

#app,
#print {
  margin: auto;
}
@media print {
  #app {
    display: none;
  }
  #print {
    display: block;
    width: auto;
  }
}

nav {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
}

.card,
.card-alt,
.card-qr {
  border-radius: 1rem;
  margin: 1rem 0;
}
.card,
.card-alt {
  padding: 1rem 3rem;
}
.card,
.card-qr {
  box-shadow: 0 0 3rem var(--c_border-main);
  background-color: var(--c_bg-card);
}
.card-qr {
  display: inline-flex;
  margin: 0.5rem;
}
.card-qr canvas {
  width: 100%;
  max-width: 200px;
}
.card-qr:not(.remaining) {
  animation: unblur 1s ease;
}
@keyframes unblur {
  0% {
    filter: brightness(150%);
  }
  100% {
    filter: none;
  }
}
.card-alt {
  background-color: var(--c_bg-emphasis-main);
  color: var(--c_text-onEmphasis);
}
.card[framed="true"] {
  border: 1px solid var(--c_border-main);
}
.card[transparent="true"] {
  background: transparent;
  box-shadow: none;
}
.card[transparent="true"] .card-title {
  border-bottom-color: transparent;
}
.card[transparent="true"] .button-card {
  background-color: var(--c_bg-emphasis-main);
  color: var(--c_text-onEmphasis);
  text-decoration: none;
}
.card[transparent="true"] .button-card:hover {
  background-color: var(--c_bg-emphasis-dark);
}
.card-title {
  width: calc(100% + 6rem);
  margin: -1rem 0 0 -3rem;
  padding: 1rem 3rem;
  text-align: center;
  border-bottom: 1px solid var(--c_border-light);
}
.button-card {
  width: 100%;
  background: inherit;
  text-decoration: underline;
}
.button-card,
.button-icon {
  color: var(--c_text-secondary);
}
.button-card:hover,
.button-icon:hover {
  color: var(--c_text-main);
}

h1 {
  font-weight: 600;
  font-size: 3.5rem;
  line-height: 0.9em;
  letter-spacing: -0.02em;
}
h2 {
  font-size: 2.5rem;
  font-weight: 500;
}
a {
  color: var(--c_accent);
}
label {
  font-size: 1.6rem;
  color: var(--c_text-secondary);
}
input,
textarea {
  width: 100%;
  background: var(--c_bg-card);
  border: 1px solid var(--c_border-main);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 2rem;
  font-family: var(--f_main);
}
textarea {
  min-height: 120px;
}
input:disabled,
textarea:disabled {
  background: transparent;
  opacity: 0.5;
}
#logo {
  text-decoration: none;
  font-weight: 700;
  font-size: 250%;
  margin: 10px auto 0;
  color: var(--c_text-main);
}
#logo:hover > .logo-text {
  text-decoration: underline;
}
#logo > .logo-icon {
  position: relative;
  top: 5px;
  left: 5px;
  font-size: 140%;
}
.button-nav {
  display: inline-block;
  font-weight: 600;
  font-size: 1.4em;
  border: 1px solid transparent;
  padding: 1rem 3rem 1.2rem;
  margin: 0 1rem 0 0;
  border-radius: 1rem;
  text-decoration: none;
  background-color: var(--c_bg-emphasis-main);
  color: var(--c_text-onEmphasis);
  text-decoration: none;
}
.button-nav:hover,
.button-nav.router-link-exact-active {
  border-color: var(--c_border-main);
}
.button-nav.router-link-exact-active {
  background-color: var(--c_bg-app);
  color: var(--c_text-main);
}

button {
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  border: none;
  font-size: 2.3rem;
  font-weight: 600;
  cursor: pointer;
}
.button-icon {
  padding: 1rem;
  font-size: 4rem;
  line-height: 0.8em;
  background: transparent;
}

.version-footer {
  padding-top: 30px;
  font-size: 80%;
  font-style: italic;
  color: darkgray;
  text-align: center;
}
@media screen and (max-width: 415px) {
  .fold input:checked ~ .fold-content {
    margin-bottom: 100px;
  }
}
</style>
