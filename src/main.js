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

Vue.prototype.BULD_TARGET = process.config.variables.built_with_electron ? 'electron' : 'browser'

// To use console log in Build
// Run App like:
// npm run electron-build && dist/mac/banana_split.app/Contents/MacOS/banana_split
//
// Then the folowing will work:
// const nodeConsole = require('console');
// const myConsole = new nodeConsole.Console(process.stdout, process.stderr);
// myConsole.log(Vue.prototype.BULD_TARGET, 'built_with_electron');
//
// END: Console log in Build



Vue.prototype.$eventHub = new Vue()

new Vue({
  router,
  render: function (h) {
    return h(App) }
}).$mount('#app')
