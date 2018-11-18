<template>
<div>
    <h1>Share secrets</h1>
    <textarea v-model="secret" placeholder="Your secret goes here"></textarea>
    <p>{{shards}}</p>
</div>
</template>

<script>
const SECRETS = require('secrets.js-grempe');

export default {
    name: 'Share',
    data: function () {
        return {
            secret: ''
        }
    },
    computed: {
        shards: function() {
            if (this.secret === '') {
                return []
            }
            return SECRETS.share(SECRETS.str2hex(this.secret), 5, 3)
        }
    }
}
</script>

<style>

</style>
