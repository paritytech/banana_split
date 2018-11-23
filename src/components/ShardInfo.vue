<script>
import Vue from 'vue'

import ShardQrCode from "./ShardQrCode";

export default {
    name: 'ShardInfo',
    props: {
        title: String,
        shard: String,
        requiredShards: Number
    },
    components: {ShardQrCode},
    render: function () {
        var element = document.createElement('div');
        document.body.appendChild(element);
        var passedProps = this.$props;
        this.vm = new Vue({
            el: element,
            render: function(h) {
                return h(ShardQrCode, {props: passedProps})
            }
        });
        return this.vm;
    },
    beforeDestroy: function() {
        this.vm.$el.remove();
        this.vm.$destroy();
    }
}
</script>