<template>
<div>
    <h1>Share secrets</h1>
    <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
    <p><input type="range" v-model.number="totalShards" v-bind:min="requiredShards" max="16"/>{{totalShards}}</p>
    <p><input type="range" v-model.number="requiredShards" min="1" v-bind:max="totalShards"/>{{requiredShards}}</p>
    <p>{{shards}}</p>
</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

export default {
    name: 'Share',
    data: function () {
        return {
            secret: '',
            totalShards: 5,
            requiredShards: 3
        }
    },
    computed: {
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

</style>
