<template>
<div>
    <div id="share-controls">
        <h1>Share secrets</h1>
        <p>What is this thing? <input type="text" :disabled="encryptionMode" v-model="title" placeholder="Like, 'Bitcoin seed phrase'" autofocus/></p>
        <textarea v-model="secret" :disabled="encryptionMode" placeholder="Your secret goes here"></textarea>
        <p>Will require any {{requiredShards}} shards out of <input type="number" v-model.number="totalShards" min="3" />
            to reconstruct</p>
        <button v-on:click="toggleMode">
            <span v-if="this.encryptionMode">Back to editing data</span>
            <span v-else>Generate QR codes!</span>
        </button>
        <div v-if="this.encryptionMode">
            <button id="print-btn" v-on:click="print">Print us!</button>
        </div>
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
            recoveryPassphrase: "",
            encryptionMode: false,
        }
    },
    components: { ShardInfo, CanvasText },
    computed: {
        requiredShards: function () {
            return Math.floor(this.totalShards / 2) + 1;
        },
        shards: function () {
            if (!this.encryptionMode) {
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
        },
        toggleMode: function () {
            this.encryptionMode = !this.encryptionMode;
        }
    },
    mounted: function() {
        this.$eventHub.$emit('foldGeneralInfo')
    }
}
</script>

<style>
#qr-tiles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

#print-btn {
    margin-top: 20px;
    font-size: x-large;
}

@media screen {
    #qr-tiles {
        width: calc(70%);
        margin-left: calc(15%);
        flex-direction: row;
    }
}

</style>
