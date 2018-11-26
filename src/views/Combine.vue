<template>
<div>
    <h1>Combine shards<span v-if="title"> for {{title}}</span></h1>
    <div v-if="needMoreShards">
    <qrcode-stream v-on:decode="onDecode"/>
    <qriously v-for="code in qrCodes" v-bind:key="code" v-bind:value="code" v-bind:size="200" />
    </div>
    <div v-else>
        <input type="text" v-model="passphrase" v-on:keyup.enter="reconstruct" autofocus/>
        <button v-on:click="reconstruct">&#x21b2;</button>
    </div>
    <h2 v-if="recoveredSecret">{{recoveredSecret}}</h2>
</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

import crypto from "../util/crypto";

export default {
    name: 'Combine',
    data: function() {
        return {
            title: "",
            nonce: "",
            shards: new Set(),
            qrCodes: [],
            requiredShards: undefined,
            passphrase: "",
            recoveredSecret: undefined
        }
    },
    computed: {
        needMoreShards: function () {
            return (!this.requiredShards) || (this.qrCodes.length < this.requiredShards);
        },
    },
    methods: {
        onDecode: function(result) {
            var parsed = crypto.parse(result);
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
                if ((this.requiredShards) && (this.requiredShards != parsed.requiredShards)) {
                    console.log("requiredShards mismatch");
                    return;
                } else {
                    this.requiredShards = parsed.requiredShards;
                }
                this.qrCodes.push(result);
                this.shards.add(parsed);
            } else {
                console.log("Shard already seen");
            }
        },
        reconstruct: function() {
            if (!this.passphrase) { return; }
            this.passphrase = this.passphrase.split(" ").filter(el => el).join('-');
            this.recoveredSecret = crypto.reconstruct(Array.from(this.shards), this.passphrase);
        }
    }
}
</script>

<style>

</style>
