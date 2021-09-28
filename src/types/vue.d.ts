// Make sure to import 'vue' before declaring augmented types
// eslint-disable-next-line no-unused-vars
import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $eventHub: Vue;
    vm: Vue;
    isOnline: boolean;
  }
}
