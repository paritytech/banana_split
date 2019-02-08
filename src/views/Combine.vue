<template>
<div>
    <h1>Combine shards<span v-if="title"> for "{{title}}"</span></h1>
    <div v-if="needMoreShards">
    <qrcode-stream v-on:decode="onDecode"/>
    <qriously v-for="code in qrCodes" v-bind:key="code" v-bind:value="code" v-bind:size="200" />
    </div>
    <div v-else>
        <button id="showsecret-btn" v-on:click="reconstruct">Click here to show the secret</button>
    </div>
    <h2 v-if="recoveredSecret">{{recoveredSecret}}</h2>
</div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

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
                if ((this.title) && (this.title != parsed.title)) {
                    console.error("title mismatch!");
                    return;
                } else {
                    this.title = parsed.title;
                }
                if ((this.nonce) && (this.nonce != parsed.nonce)) {
                    console.error("nonce mismatch!");
                    return;
                } else {
                    this.nonce = parsed.nonce;
                }
                if ((this.requiredShards) && (this.requiredShards != parsed.requiredShards)) {
                    console.error("requiredShards mismatch");
                    return;
                } else {
                    this.requiredShards = parsed.requiredShards;
                }
                this.qrCodes.push(result);
                this.shards.add(parsed.data);
            } else {
                console.warn("Shard already seen");
            }
        },
        reconstruct: function() {
            this.passphrase = this.passphrase.split(" ").filter(el => el).join('-');
            this.recoveredSecret = crypto.reconstruct(Array.from(this.shards), this.title, this.passphrase, this.nonce);
        }
    },
    mounted: function() {
        this.$eventHub.$emit('foldGeneralInfo')
    }
}
</script>

<style>
    #showsecret-btn {
        font-size: x-large;
    }
</style>
