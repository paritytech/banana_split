import Vue from "vue";
import Router from "vue-router";

import Info from "./views/Info";
import Share from "./views/Share";
import Combine from "./views/Combine";

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
    }
  ]
});
