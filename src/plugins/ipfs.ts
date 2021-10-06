/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { VueConstructor } from "vue";
const Hash = require("ipfs-only-hash");

const plugin = {
  install(Vue: VueConstructor) {
    const vm = new Vue({
      data: {
        cid: "UNKNOWN"
      }
    });

    fetch(window.location.href)
      .then(response => {
        return response.text();
      })
      .then(data => {
        Hash.of(data).then((hash: string) => {
          vm.$data.cid = hash;
        });
      })
      .catch(error => console.error(error));

    Vue.mixin({
      computed: {
        cid() {
          return vm.$data.cid;
        }
      }
    });
  }
};
export default plugin;
