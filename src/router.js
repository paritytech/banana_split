import Vue from 'vue'
import Router from 'vue-router'
import Share from './views/Share'
import Combine from './views/Combine.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'share',
      component: Share
    },
    {
      path: '/combine',
      name: 'combine',
      component: Combine
    }
  ]
})
