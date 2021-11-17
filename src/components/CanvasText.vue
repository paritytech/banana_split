<template>
  <canvas v-canvas-message="text" class="canvasText" width="0" height="28px" />
</template>

<script lang="ts">
import Vue, { VNodeDirective } from "vue";

export default Vue.extend({
  name: "CanvasText",
  directives: {
    canvasMessage: function(el: HTMLElement, binding: VNodeDirective): void {
      const canvasElement = el as HTMLCanvasElement;
      const context = canvasElement.getContext("2d");
      if (!context) {
        // eslint-disable-next-line no-console
        console.warn("Failed to find canvasElement context");
        return;
      }
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      context.fillStyle = "black";
      context.font = "20px Arial";
      const textWidth = context.measureText(binding.value).width || 450;
      const padLeftPx = 15;
      canvasElement.setAttribute("width", textWidth + padLeftPx + "px");
      context.font = "20px Arial";
      context.fillText(binding.value, padLeftPx, 20);
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
