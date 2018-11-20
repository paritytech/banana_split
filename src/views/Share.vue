<template>
<div>
    <h1>Share secrets</h1>
    <p>What is this thing? <input type="text" v-model="title" placeholder="Like, 'Bitcoin seed phrase'"/></p>
    <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
    <p>Will require any {{requiredShards}} shards out of <input type="number" v-model.number="totalShards" min="3"/> to reconstruct</p>
    <p>Your passphrase for the recovery is: {{recoveryPassphrase}}<button v-on:click="regenPassphrase">&#x21ba;</button></p>

    <div class="qr-tiles">
        <div class="qr-tile" v-for="shard in shards" v-bind:key="shard">
            <qriously v-bind:value="shard" v-bind:size="200" />
        </div>
    </div>

</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

import bipPhrase from '../util/bipPhrase';
import crypto from '../util/crypto';

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
    computed: {
        requiredShards: function() {
            return Math.floor(this.totalShards/2)+1;
        },
        shards: function() {
            if (this.secret === '') {
                return []
            }
            var encrypted = crypto.encrypt(this.secret, this.title, this.recoveryPassphrase);
            var hexEncrypted = crypto.hexify(encrypted.nonce) + crypto.hexify(encrypted.value);

            return SECRETS.share(hexEncrypted, this.totalShards, this.requiredShards);
        }
    },
    methods: {
        regenPassphrase: function() {
            this.recoveryPassphrase = bipPhrase.generate(4);
        }
    }
}
</script>

<style>
.qr-tiles {
    display: flex;
    width: calc(70%);
    max-width: 1000px;
    margin: auto;
    flex-wrap: wrap;
}

</style>
