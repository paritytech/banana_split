<template>
    <div class="qr-tile">
        <div class="print-only">
            <h1>{{title}}</h1>
            <h3>You need {{requiredShards - 1}} more QR {{pluralizeCode}} like this to reconstruct the secret</h3>
            <h4>Please go to <a href="https://bs.parity.io">https://bs.parity.io</a> to download the reconstruction webapp, if you don't have one already</h4>
        </div>
        <qriously class="print-only" v-bind:value="shard" v-bind:size="750" />
        <qriously class="screen-only" v-bind:value="shard" v-bind:size="200" />
        <div class="print-only">
            <div class="recovery-field">
                <div class="recovery-title">Recovery&nbsp;passphrase&nbsp;is&nbsp;</div>
                <div class="recovery-blank"/>
            </div>
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
    },
    computed:{
        pluralizeCode: function() {
            if (this.requiredShards-1 === 1) {
                return 'code'
            } else {
                return 'codes'
            }
        }
    }
}
</script>

<style>
@media screen {
    .print-only {
        display: none;
    }

    .qr-tile {
        display: inline-block;
    }
}

@media print {
    .screen-only {
       display: none;
   }

    .qr-tile {
        page-break-after: always;
    }
}

.recovery-field {
    width: 100%;
    display: flex;
}

.recovery-blank {
    width: 100%;
    border-bottom: 1px solid black;
}
</style>
