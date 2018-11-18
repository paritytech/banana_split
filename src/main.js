import Vue from 'vue'
import App from './App.vue'
import router from './router'
import OnlinePlugin from './plugins/online'

Vue.config.productionTip = false
Vue.use(OnlinePlugin)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
