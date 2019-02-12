import Vue from 'vue'
import Router from 'vue-router'

import Welcome from './components/views/Welcome'
import SplitSecret from './components/views/SplitSecret'
import RestoreSecret from './components/views/RestoreSecret'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'info',
      component: Welcome
    },
    {
      path: '/split',
      name: 'splitSecret',
      component: SplitSecret
    },
    {
      path: '/restore',
      name: 'restoreSecret',
      component: RestoreSecret
    }
  ]
})
