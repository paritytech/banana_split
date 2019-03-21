<template>
    <slider height="15em" indicators="left" :autoplay="false">
        <slider-item>
            <h2>Shamir Secret Sharing <br/><small>for people with friends</small></h2>
            <p>
                Banana Split uses <a target="_blank" href="https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing">Shamir's secret sharing</a> to make your paper backups more resilient and secure.
            </p>
        </slider-item>
        <slider-item>
            <p>
                You can use Banana Split to cut <strong>a secret</strong> (any text string) into multiple <em>shards</em>.
                <br />The <em>shards</em> are QR codes you will have to print.
            </p>
            <p>
                Recovery can be done on any device with a webcam — just show your QR codes to the webcam and follow the notifications on screen in the process.
                <br />To restore the secret you need to <strong>scan <em>only some</em>  of the shards</strong> and enter the passphrase to restore the secret.
            </p>
        </slider-item>
        <slider-item>
            <p>
                <strong>For example</strong>
                <br/>share your secret with 5 friends you will need 5 shards (n=5).
                <br/>You print out the 5 QR pages and make sure also the passphrase is saved.
                <br>You'll need n/2+1 of those printouts to reconstruct the secret. 3 of your 5 friends are required to restore your secret.
            </p>
        </slider-item>
        <slider-item>
            <p>Banana Split tries to protect your secret from the attack vectors like "attacker is able to intercept everything
                you're sending to your printer", and that's why you'll have to write down the passphrase on your printouts by hand.</p>
        </slider-item>
        <slider-item>
            <p>
                <strong>Software availibility</strong>
                <br />
                Banana Split is available as a self-contained HTML page, and should only be opened from your local Documents folder,
                while browser is in the Offline mode — this way the risk of compromise will be minimal.</p>
                 <p v-if="!IS_ELECTRON_BUILD">We are working on a Electron app.</p>
                 <p v-if="IS_ELECTRON_BUILD">
                     <strong>Electron App</strong>
                     <br />
                     You seem to use the Electron app.
                 </p>
        </slider-item>
        <slider-item>
            <p>
                <strong>NO WARRENTY</strong>
                <br />Theis software is released under GNU GENERAL PUBLIC LICENSE. There is no warranty for this free software!
                <br />Make sure to
            </p>
            <ul>
                <li>Safe a backup of the software (there is a single html page which allows you to run Bananna Split in Chromium Browsers)</li>
                <li>you also add the passphrase to the QR code print "shares"</li>
                <li>test your restore process and ensure software availability yourself when you need to rely on it.</li>
            </ul>

        </slider-item>
    </slider>
</template>

<script>
import { Slider, SliderItem } from 'vue-easy-slider'

export default {
    name: 'Welcome',
    components: {
        Slider,
        SliderItem
    },
    methods: {
        next($event) {
            window.console.log(`hello index: ${$event}`)
        },
    }
}
</script>

<style>
    .slider-item {
        width: 70% !important;
        padding-left: 15% !important;
    }
    .slider-btn-right,
    .slider-btn-left {
        width: 13% !important;
        background: none !important;
        padding-bottom: 3em;
    }
    .slider-icon {
        border-color: #5c5c5c !important;
        border-left-width: 5px !important;
        border-bottom-width: 5px !important;
    }
    .slider-indicator-icon.slider-indicator-active {
        background-color: #5c5c5c !important;
    }
</style>
