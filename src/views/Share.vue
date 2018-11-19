<template>
<div>
    <h1>Share secrets</h1>
    <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
    <p>Will require at least {{requiredShards}} shards out of <input type="number" v-model.number="totalShards" min="3"/> to reconstruct</p>
    <p>Your passphrase for the recovery is: {{recoveryPassphrase}}</p>

    <div class="qr-tiles">
        <div class="qr-tile" v-for="shard in shards" v-bind:key="shard">
            <qriously v-bind:value="shard" size="200"/>
        </div>
    </div>

</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');
import bipPhrase from '../util/bipPhrase';

export default {
    name: 'Share',
    data: function () {
        return {
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
            return SECRETS.share(SECRETS.str2hex(this.secret), this.totalShards, this.requiredShards)
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
