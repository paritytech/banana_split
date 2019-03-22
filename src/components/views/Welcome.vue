<template>
  <div class="slider-wrap">
    <div class="prev-Link">
      <div v-if="showPrev" v-on:click="prevSlide"><span>◤</span></div>
    </div>
    <slider
        ref="Slider"
        direction="horizontal"
        :performance-mode="true"
        :pagination-clickable="true"
        :pagination-visible="true"
        @slide-change-end="onSlideChange"
        :style="sliderHeight"
    >
      <Slide>
        <h2>Shamir Secret Sharing</h2>
        <h4>for people with friends</h4>
        <p>
          Banana Split uses <a target="_blank" href="https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing">Shamir's secret sharing</a> to make your paper backups more resilient and secure.
        </p>
      </Slide>
      <Slide>
        <h4>Encrypting Secrets</h4>
        <p>
          You can use Banana Split to cut <strong>a secret</strong> (any text string) into multiple <em>shards</em>.
          <br />The <em>shards</em> are QR codes you will have to print.
        </p>
        <h4>Decrypting</h4>
        <p>
          Recovery can be done on any device with a webcam — just show your QR codes to the webcam and follow the notifications on screen in the process.
          <br />To restore the secret you need to <strong>scan <em>only some</em>  of the shards</strong> and enter the passphrase to restore the secret.
        </p>
      </Slide>
      <Slide>
        <h4>A example</h4>
        <p>
          Your plan is to share your <em>Bitcoin billionaire seed phrase</em> with 5 friends. You will need 5 shards (n=5).
          <br/>You print out the 5 QR pages and make sure also the passphrase is saved.
        </p>
        <p>To reconstruct the secret, you will need n/2+1 of those printouts. So 3 of your 5 friends will be required to restore your secret.</p>
      </Slide>
      <Slide>
        <h4>The passphrase</h4>
        <p>Banana Split tries to protect your secret from the attack vectors like "attacker is able to intercept everything
          you're sending to your printer", and that's why you'll have to <strong>write down the passphrase on your printouts by hand</strong>.</p>
      </Slide>
      <Slide>
        <h4>Software availibility</h4>
        <p>
          Banana Split is available as a self-contained HTML page, and should only be opened from your local Documents folder,
          while browser is in the Offline mode — this way the risk of compromise will be minimal.</p>
        <p v-if="!IS_ELECTRON_BUILD">We are working on a Electron app.</p>
        <p v-if="IS_ELECTRON_BUILD">
          <strong>Electron App</strong>
          <br />
          You seem to use the Electron app.
        </p>
      </Slide>
      <Slide>
        <h4>NO WARRANTY</h4>
        <p>
          This software is released under GNU GENERAL PUBLIC LICENSE. There is no warranty for this free software!
          <br />Make sure to
        </p>
        <ul>
          <li>Safe a backup of the software (there is a single html page which allows you to run Bananna Split in Chromium Browsers)</li>
          <li>you also add the passphrase to the QR code print "shares"</li>
          <li>test your restore process and ensure software availability yourself when you need to rely on it.</li>
        </ul>
      </Slide>
    </slider>
    <div class="next-Link">
      <div v-if="showNext" v-on:click="nextSlide" ><span>◢</span></div>
    </div>
  </div>
</template>

<script>
  // import Slider from 'vue-plain-slider' will crash the electron build process.
  import Slider from 'vue-plain-slider/dist/vue-plain-slider.umd.min.js'
  import 'vue-plain-slider/dist/vue-plain-slider.css'

  import Slide from '../Slide'


  export default {
    name: 'Welcome',
    components: {
      Slider, Slide
    },
    data() {
      return {
        showPrev: false,
        showNext: true
      }
    },
    computed: {
      sliderHeight: function () {
        if(this.IS_ELECTRON_BUILD) {
          return {height: '400px'}
        }
        return {height: 'auto'}
      }
    },
    methods: {
      nextSlide: function() {
        this.$refs.Slider.next()
      },
      prevSlide: function() {
        this.$refs.Slider.prev()
      },
      onSlideChange (currentPage) {
        this.showPrev = currentPage !== 1
        this.showNext = currentPage !== this.$refs.Slider.$children.length
      }
    },
    mounted() {
      const self = this;
      window.addEventListener('keyup', function(ev) {
        if (ev.code === 'ArrowRight' ) {
          self.$refs.Slider.next()
        }
        if (ev.code === 'ArrowLeft' ) {
          self.$refs.Slider.prev()
        }
      });
    }
  }
</script>

<style>
  .slider {
    /* We may rely on auto height, but fixed looks better in electron. */
    /*height: 400px;*/
    padding-bottom: 25px;
    width: 70%;
  }
  .slider-wrap {
    display: flex;
  }
  .prev-Link,
  .next-Link {
    width: 13%;
  }
  .prev-Link > div,
  .next-Link  > div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
  }
  .prev-Link > div > span,
  .next-Link  > div > span {
    transform: rotate(-45deg);
  }
  .slider .slider-pagination .slider-pagination-bullet.active {
    background: Highlight;
    opacity: 1;
  }
</style>
