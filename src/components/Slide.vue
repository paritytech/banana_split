<template>
      <div class="slide-wrap">
        <div class="inner">
          <div class="inner--centered">
            <slot />
          </div>
        </div>
      </div>
</template>

<script>
  export default {
    name: 'Slide',
    methods: {
      next: function () {
        this.$parent.next()
      },
      prev: function () {
        this.$parent.prev()
      }
    }
  }
</script>

<style>
  .inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h1, h2, h3, h4 {
    margin: 0;
  }
</style>
