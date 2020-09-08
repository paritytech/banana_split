<script>
import Vue from "vue";

import ShardQrCode from "./ShardQrCode";

export default {
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
  render: function() {
    var element = document.createElement("div");
    var print = document.getElementById("print");
    print.appendChild(element);
    var passedProps = this.$props;
    this.vm = new Vue({
      el: element,
      render: function(h) {
        return h(ShardQrCode, { props: passedProps });
      }
    });
    return this.vm;
  }
};
</script>
