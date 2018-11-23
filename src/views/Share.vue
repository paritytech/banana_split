<template>
<div>
    <div id="share-controls">
        <h1>Share secrets</h1>
        <p>What is this thing? <input type="text" v-model="title" placeholder="Like, 'Bitcoin seed phrase'" autofocus/></p>
        <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
        <p>Will require any {{requiredShards}} shards out of <input type="number" v-model.number="totalShards" min="3" />
            to reconstruct</p>
        <p>Your passphrase for the recovery is: {{recoveryPassphrase}}<button v-on:click="regenPassphrase">&#x21ba;</button></p>
        <button v-if="this.secret" v-on:click="print">Print us!</button>
    </div>

    <div id="qr-tiles">
        <shard-info v-for="shard in shards" v-bind:key="shard" v-bind:shard="shard" v-bind:requiredShards="requiredShards"
            v-bind:title="title" />
    </div>
</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

import bipPhrase from '../util/bipPhrase';
import crypto from '../util/crypto';

import ShardInfo from '../components/ShardInfo';

export default {
    name: 'Share',
    data: function () {
        return {
            title: '',
            secret: '',
            totalShards: 5,
            recoveryPassphrase: bipPhrase.generate(4)
        }
    },
    components: { ShardInfo },
    computed: {
        requiredShards: function() {
            return Math.floor(this.totalShards/2)+1;
        },
        shards: function() {
            if (this.secret === '') {
                return []
            }
            var encrypted = crypto.encrypt(this.secret, this.title, this.recoveryPassphrase);
            var hexNonce = crypto.hexify(encrypted.nonce);
            var hexEncrypted = crypto.hexify(encrypted.value);
            return SECRETS.share(hexEncrypted, this.totalShards, this.requiredShards).map(function(shard){
                return JSON.stringify({
                    title: encrypted.salt,
                    data: shard,
                    nonce: hexNonce
                });
            });
        }
    },
    methods: {
        regenPassphrase: function() {
            this.recoveryPassphrase = bipPhrase.generate(4);
        },
        print: function () {
            window.print()
        }
    }
}
</script>

<style>
#qr-tiles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

@media screen {
    #qr-tiles {
        width: calc(70%);
        margin-left: calc(15%);
        flex-direction: row;
    }
}

@media print {
    #share-controls {
        display: none;
    }
    #qr-tiles {
        flex-direction: column;
    }
}

</style>
