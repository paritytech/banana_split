import { VueConstructor } from "vue";

const plugin = {
  install(Vue: VueConstructor) {
    const vm = new Vue({
      data: {
        online: window.navigator.onLine
      }
    });

    window.addEventListener("online", function handleOnline() {
      vm.$data.online = true;
    });

    window.addEventListener("offline", function handleOffline() {
      vm.$data.online = false;
    });

    Vue.mixin({
      computed: {
        isOnline() {
          return vm.$data.online;
        }
      }
    });
  }
};
export default plugin;
