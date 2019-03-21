import Vue from 'vue'

import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

import QrcodeStream from "vue-qrcode-reader"
Vue.use(QrcodeStream)

import App from './App.vue'
import router from './router'

import OnlinePlugin from './plugins/online'
Vue.use(OnlinePlugin)

Vue.config.productionTip = false

Vue.prototype.IS_ELECTRON_BUILD = (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes('electron'))
                            || (process.config && process.config.variables.built_with_electron);

// To use console log in ELECTRON BUILD
// Run App like:
// npm run electron-build && dist/mac/banana_split.app/Contents/MacOS/banana_split
//
// Following will work only in Electron build not in npm development:
// const nodeConsole = require('console');
// const myConsole = new nodeConsole.Console(process.stdout, process.stderr);
// myConsole.log(Vue.prototype.IS_ELECTRON, 'IS ELECTRON');
// myConsole.log(Vue.prototype.BULD_TARGET, 'IS BROWSER');
//
// END: Console log in Build



Vue.prototype.$eventHub = new Vue()

new Vue({
  router,
  render: function (h) {
    return h(App) }
}).$mount('#app')
