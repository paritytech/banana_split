import Vue from 'vue'

import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

import App from './App.vue'
import router from './router'

import OnlinePlugin from './plugins/online'
Vue.use(OnlinePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
