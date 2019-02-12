<template>
<div>
    <div class="columns">
        <div>
            <div v-if="!title">
                <p>&#128129; Scan first QR-Code to gather set data.</p>
                <div class="shares">
                    <ScanMe />
                </div>
            </div>
            <div v-if="title && requiredShards && qrCodes">
                <p><span class="small-text">Name</span><strong>{{title}}</strong></p>
                <div class="shares">
                    <qriously v-for="code in qrCodes" :key="code" :value="code" :size="100" />
                    <ScanMe qriously v-for="n in (missingShards)" :key="n"/>
                </div>
                <p v-if="qrCodes.length < requiredShards">
                    ⚠ To solve the secret {{ missingShards }} more Shard{{ missingShards > 1 ? "s" : ""}} are required.
                </p>
                <p class="small-text">
                    Scanned are {{ qrCodes.length }} of {{totalShards}} previously created Shards.
                </p>
                <p v-if="qrCodes.length === requiredShards">
                    ✓ Got all required shares to recover.
                </p>
            </div>
        </div>
        <div>
            <div v-if="needMoreShards" class="scan-preview" >
                <div class="scan-preview--loading">
                  Waiting<br/>for<br/>camera
                </div>
                <qrcode-stream
                    v-on:decode="onDecode"
                    class="camera"
                    :camera="{ width: 372, height: 306 }"
                />
                <!-- :camera="{ width: 360, height: 300 }" -->
            </div>
            <div v-else class="enter-passphrase">
                <h3>Enter passphrase</h3>
                <div  v-if="!recoveredSecret">
                    <input
                        type="text"
                        v-model="passphrase"
                        v-on:keyup.enter="reconstruct"
                        autofocus
                        :disabled="recoveredSecret"
                    />
                    <button
                        type=submit
                        v-on:click="reconstruct"
                        v-on:submit="reconstruct"
                        :disabled="recoveredSecret"
                    >&#x21b2;</button>
                </div>
                <div v-else>
                <p>✓ Passphrase accepted</p>
                </div>
            </div>
            <div v-if="recoveredSecret">
                <h3>Recovered secret</h3>
                <pre class="recovered">{{recoveredSecret}}</pre>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

import crypto from "../../util/crypto";
import ScanMe from "../ScanMe";

export default {
    name: 'RestoreSecret',
    data: function() {
        return {
            title: "",
            nonce: "",
            shards: new Set(),
            qrCodes: [],
            requiredShards: undefined,
            passphrase: "",
            recoveredSecret: undefined
        }
    },
    components: {
        ScanMe
    },
    computed: {
        needMoreShards: function () {
            return (!this.requiredShards) || (this.qrCodes.length < this.requiredShards);
        },
        totalShards: function () {
            return (!this.requiredShards) || (this.requiredShards * 2) -1;
        },
        missingShards: function () {
            if (this.requiredShards && this.qrCodes.length) {
                return this.requiredShards - this.qrCodes.length
            }
            return null
        }
    },
    methods: {
        onDecode: function(result) {
            var parsed = crypto.parse(result);
            if (!this.shards.has(parsed.data)) {
                if ((this.title) && (this.title != parsed.title)) {
                    console.error("title mismatch!");
                    return;
                } else {
                    this.title = parsed.title;
                }
                if ((this.nonce) && (this.nonce != parsed.nonce)) {
                    console.error("nonce mismatch!");
                    return;
                } else {
                    this.nonce = parsed.nonce;
                }
                if ((this.requiredShards) && (this.requiredShards != parsed.requiredShards)) {
                    console.error("requiredShards mismatch");
                    return;
                } else {
                    this.requiredShards = parsed.requiredShards;
                }
                this.qrCodes.push(result);
                this.shards.add(parsed);
            } else {
                console.warn("Shard already seen");
            }
        },
        reconstruct: function() {
            if (!this.passphrase) { return; }
            this.passphrase = this.passphrase.split(" ").filter(el => el).join('-');
            this.recoveredSecret = crypto.reconstruct(
                Array.from(this.shards).map(a => a.data),
                Array.from(this.shards).pop().title,
                this.passphrase,
                Array.from(this.shards).pop().nonce
            );
        }
    },
    mounted: function() {
        this.$eventHub.$emit('foldGeneralInfo')
    }
}
</script>

<style>
.small-text {
    font-size: small;
    display: block;
    color: gray;
}
.columns {
    display: flex;
    align-items: stretch;
    max-width: 1024px;
}
.columns > div:first-child {
    width: 372px;
    height: 306px;
    margin-right: 20px;
}
.columns > div {
    min-width: 25%;
    max-width: 50%;
    margin-right: 20px;
}
.columns > div >h3:first-child {
    margin-top: 0;
}
.scan-preview {
    width: 100%;
    position: relative;
}
.scan-preview--loading {
  color: #b2b2b2;
  position: absolute;
  padding: 4em 0;
  font-size: large;
  text-align: center;
  width: 100%;
}
.shares {
    display: flex;
}
.shares > div,
.shares > svg{
    height: 100px;
    width: 100px;
    margin: 0 10px 10px 0;
}
.recovered {
    background: InfoBackground;
    color: InfoText;
    padding: 5px 10px;
}
.camera {
   transform: scaleX(-1);
    max-width: 100%;
    height: auto;

}
</style>
