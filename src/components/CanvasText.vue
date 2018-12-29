<template>
    <canvas class="canvasText" width="0" height="28px" v-canvas-message="text"></canvas>
</template>

<script>
export default {
    name: 'CanvasText',
    props: {
        text: String
    },
    directives: {
        canvasMessage: function(canvasElement, binding) {
            var context = canvasElement.getContext("2d");
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);
            context.fillStyle = "black";
            context.font = "20px Arial";
            var textSize = context.measureText(binding.value);
            canvasElement.setAttribute("width", (textSize.width+30)+"px");
            context.font = "20px Arial";
            context.fillText(binding.value, 15, 20)
        }
    }
}
</script>

<style>
  .canvasText {
      margin-bottom: -8px;
  }
</style>
