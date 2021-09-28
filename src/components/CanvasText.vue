<template>
  <canvas v-canvas-message="text" class="canvasText" width="0" height="28px" />
</template>

<script lang="ts">
import Vue, { VNodeDirective } from "vue";

export default Vue.extend({
  name: "CanvasText",
  directives: {
    canvasMessage: function(el: HTMLElement, binding: VNodeDirective): void {
      const canvasElement = el as HTMLCanvasElement,
        context = canvasElement.getContext("2d");
      if (!context) {
        // eslint-disable-next-line no-console
        console.warn("Failed to find canvasElement context");
        return;
      }
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      context.fillStyle = "black";
      context.font = "20px Arial";
      const textSize = context.measureText(binding.value);
      canvasElement.setAttribute("width", textSize.width + 20 + "px");
      context.font = "20px Arial";
      context.fillText(binding.value, 15, 20);
    }
  },
  props: {
    text: {
      type: String,
      required: true
    }
  }
});
</script>
