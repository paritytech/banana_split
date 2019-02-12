<template>
<div>
    <form id="share-controls" @submit.prevent="toggleMode">
        <div>Carve your secrets into shards.</div>
        <p>
            <label for="name">Name</label>
            <input
                id="name"
                type="text"
                :disabled="encryptionMode"
                v-model="title"
                placeholder="Like, 'Bitcoin seed phrase'"
                autofocus
                style="min-width: 20em"
                required="required"
            />
        </p>
        <p>
            <label for="secret">Secret</label>
            <textarea
                id="secret"
                v-model="secret"
                :disabled="encryptionMode"
                placeholder="Your secret goes here"
                style="min-width: 20em"
                required="required"
            ></textarea>
        </p>

        <p>Will require any {{requiredShards}} shards out of
            <input
                type="number"
                v-model.number="totalShards"
                min="3"
                style="width: 3em"
                required="required"
            />
            to reconstruct
        </p>
        <input
            v-if="!this.encryptionMode"
            type="submit"
            value="Generate QR codes!"
        />
        <input
            v-if="this.encryptionMode"
            type="submit"
            value="Back to editing data"
        />

        <div v-if="this.encryptionMode">
            <p>Your passphrase for the recovery is:</p>
            <p>
                <canvas-text v-bind:text="recoveryPassphrase"/>
                <!--
                 This button is actually not necessary from UX view,
                 but to regenerate passphrase. Might combine it with mode switching.
                 -->
                <button v-on:click="regenPassphrase">&#x21ba;</button>
            </p>
            <p>
                <button v-on:click="print">Print the shards</button>
            </p>
            <p> ⚠ Dont forget to write the passphrase to the printed QR codes!</p>
        </div>
    </form>

    <div id="qr-tiles">
        <shard-info v-for="shard in shards" v-bind:key="shard" v-bind:shard="shard" v-bind:requiredShards="requiredShards"
            v-bind:title="title" />
    </div>
</div>
</template>

<script>

import bipPhrase from '../../util/bipPhrase';
import crypto from '../../util/crypto';

import ShardInfo from '../ShardInfo';
import CanvasText from '../CanvasText';

export default {
    name: 'SplitSecret',
    data: function () {
        return {
            title: '',
            secret: '',
            totalShards: 3, // TODO: 5
            recoveryPassphrase: bipPhrase.generate(4),
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
#qr-tiles .screen-only {
    display: none;
}
label {
    font-size: small;
    color: gray;
    display: block;
}
</style>
