<script lang="ts">
import Vue, { VNode } from "vue";
import ShardQrCode from "./ShardQrCode.vue";

export default Vue.extend({
  name: "ShardInfo",
  components: { ShardQrCode },
  props: {
    title: {
      type: String,
      required: true
    },
    shard: {
      type: String,
      required: true
    },
    requiredShards: {
      type: Number,
      required: true
    }
  },
  beforeDestroy: function() {
    this.vm.$el.remove();
    this.vm.$destroy();
  },
  render: function(): VNode {
    const element = document.createElement("div");
    const print = document.getElementById("print");
    if (print) {
      print.appendChild(element);
    } else {
      // eslint-disable-next-line no-console
      console.warn("Failed to find `print` element");
    }
    const passedProps = this.$props;
    this.vm = new Vue({
      el: element,
      render: function(h) {
        return h(ShardQrCode, { props: passedProps });
      }
    });
    return this.vm.$vnode;
  }
});
</script>
