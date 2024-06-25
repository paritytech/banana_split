import Vue from "vue";
import Router from "vue-router";

import Info from "./views/Info.vue";
import Share from "./views/Share.vue";
import Combine from "./views/Combine.vue";
import Print from "./views/Print.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "info",
      component: Info
    },
    {
      path: "/share",
      name: "share",
      component: Share
    },
    {
      path: "/combine",
      name: "combine",
      component: Combine
    },
    {
      path: "/print",
      name: "print",
      component: Print
    }
  ]
});
