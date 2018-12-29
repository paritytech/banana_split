<template>
<div>
    <div id="share-controls">
        <h1>Share secrets</h1>
        <p>What is this thing? <input type="text" v-model="title" placeholder="Like, 'Bitcoin seed phrase'" autofocus/></p>
        <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
        <p>Will require any {{requiredShards}} shards out of <input type="number" v-model.number="totalShards" min="3" />
            to reconstruct</p>
        <p>Your passphrase for the recovery is:</p>
        <p>
            <canvas-text v-bind:text="recoveryPassphrase"/>
            <button v-on:click="regenPassphrase">&#x21ba;</button></p>
        <button v-if="this.secret" v-on:click="print">Print us!</button>
    </div>

    <div id="qr-tiles">
        <shard-info v-for="shard in shards" v-bind:key="shard" v-bind:shard="shard" v-bind:requiredShards="requiredShards"
            v-bind:title="title" />
    </div>
</div>
</template>

<script>

import bipPhrase from '../util/bipPhrase';
import crypto from '../util/crypto';

import ShardInfo from '../components/ShardInfo';
import CanvasText from '../components/CanvasText';

export default {
    name: 'Share',
    data: function () {
        return {
            title: '',
            secret: '',
            totalShards: 3, // TODO: 5
            recoveryPassphrase: bipPhrase.generate(4)
        }
    },
    components: { ShardInfo, CanvasText },
    computed: {
        requiredShards: function () {
            return Math.floor(this.totalShards / 2) + 1;
        },
        shards: function () {
            if (this.secret === '') {
                return []
            }
            return crypto.share(this.secret, this.title, this.recoveryPassphrase, this.totalShards, this.requiredShards);
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

</style>
