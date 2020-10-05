<template>
  <canvas v-canvas-message="text" class="canvasText" width="0" height="28px" />
</template>

<script>
export default {
  name: "CanvasText",
  directives: {
    canvasMessage: function(canvasElement, binding) {
      var context = canvasElement.getContext("2d");
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      context.fillStyle = "black";
      context.font = "20px Arial";
      var textSize = context.measureText(binding.value);
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
};
</script>
