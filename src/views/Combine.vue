<template>
<div>
    <h1>Combine shards<span v-if="title"> for {{title}}</span></h1>
    <div v-if="needMoreShards">
        <qrcode-stream v-on:decode="onDecode"/>
        <div class="codes-row">
            <qriously class="qrcode" v-for="code in qrCodes" v-bind:key="code" v-bind:value="code"
                v-bind:size="200" v-bind:padding="10" />
            <qriously class="qrcode remaining" v-for="n in remainingCodes" v-bind:key="n" value='{"t":"Very secret info","r":2,"d":"803c12929ba469d720a63fc8ca6f6ef1cc441f8f0b830ea04f8a484169ec800e4a7","n":"29abbb2c509adedb470f6d3fd3d083362b8c1a9283adf987"}'
                v-bind:size="180" foreground="#aaa" v-bind:padding="15" />
        </div>
    </div>
    <div v-else>
        <input type="text" v-model="passphrase" v-on:keyup.enter="reconstruct" autofocus/>
        <button v-on:click="reconstruct">&#x21b2;</button>
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
        remainingCodes: function () {
            if (!this.requiredShards) {
                return 0;
            } else {
                return this.requiredShards - this.qrCodes.length;
            }

        }
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
                this.shards.add(parsed);
            } else {
                console.warn("Shard already seen");
            }
        },
        reconstruct: function() {
            if (!this.passphrase) { return; }
            this.passphrase = this.passphrase.split(" ").filter(el => el).join('-');
            var shards = Array.from(this.shards);
            this.recoveredSecret = crypto.reconstruct(shards, this.passphrase);
        }
    },
    mounted: function() {
        this.$eventHub.$emit('foldGeneralInfo')
    }
}
</script>

<style>
.qrcode {
    display: inline-block;
}

.qrcode.remaining {
    -webkit-filter: blur(6px);
    -moz-filter: blur(6px);
    -o-filter: blur(6px);
    -ms-filter: blur(6px);
    filter: blur(6px);
}
</style>
