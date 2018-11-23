<template>
    <div class="qr-tile">
        <div class="print-only">
            <h1>{{title}}</h1>
            <h3>You need {{requiredShards - 1}} more shards to reconstruct the secret</h3>
        </div>
        <qriously class="print-only" v-bind:value="shard" v-bind:size="600" />
        <qriously class="screen-only" v-bind:value="shard" v-bind:size="200" />
        <div class="print-only">
            <p>
                recovery passphrase is <span class="recovery-blank"/>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShardQrCode',
    props: {
        title: String,
        shard: String,
        requiredShards: Number
    }
}
</script>

<style>
@media screen {
    .print-only {
        display: none;
    }
}

@media print {
    .screen-only {
       display: none;
   } 
}

.qr-tile {
    page-break-after: always;
}

.recovery-blank {
    display: inline-block;
    width: 34em;
    border-bottom: 1px solid black;
}
</style>
