<template>
<div>
    <h1>Combine shards<span v-if="title"> for {{title}}</span></h1>
    <div v-if="needMoreShards">
    <qrcode-stream v-on:decode="onDecode"/>
    <qriously v-for="code in qrCodes" v-bind:key="code" v-bind:value="code" v-bind:size="200" />
    </div>
    <div v-else>
        <p>{{encryptedSecret}}</p>
    </div>
</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

export default {
    name: 'Combine',
    data: function() {
        return {
            title: "",
            nonce: "",
            shards: new Set(),
            qrCodes: [],
            requiredShards: undefined, // TODO - we need this both in serialization and deserialization
        }
    },
    computed: {
        needMoreShards: function () {
            return (!this.requiredShards) || (this.qrCodes.length < this.requiredShards);
        },
        encryptedSecret: function () {
            if (this.needMoreShards) {
                return;
            }
            return SECRETS.combine(Array.from(this.shards));
        },
    },
    methods: {
        onDecode: function(result) {
            var parsed = JSON.parse(result);
            if (!this.shards.has(parsed.data)) {
                console.log(parsed);

                if ((this.title) && (this.title != parsed.title)) {
                    console.log("title mismatch!");
                    return;
                } else {
                    this.title = parsed.title;
                }
                if ((this.nonce) && (this.nonce != parsed.nonce)) {
                    console.log("nonce mismatch!");
                    return;
                } else {
                    this.nonce = parsed.nonce;
                }
                this.requiredShards = 2; // TODO
                this.qrCodes.push(result);
                this.shards.add(parsed.data);
            } else {
                console.log("Shard already seen");
            }
        }
    }
}
</script>

<style>

</style>
