import Vue from 'vue'
import Router from 'vue-router'

import Info from './components/views/Info'
import Share from './components/views/Share'
import Combine from './components/views/Combine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'info',
      component: Info
    },
    {
      path: '/share',
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
