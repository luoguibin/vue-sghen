<template>
  <div class="line-adsorption">
    <canvas ref="canvas" @mousedown="onEvent($event)" @mousemove="onEvent($event)" @mouseup="onEvent($event)" @wheel="onEvent($event)"></canvas>
  </div>
</template>

<script>
import Adsorption  from "../../common/demo/line-adsorption/adsorption";

/**
 * @info:线段吸附测试<end>
 */
export default {
  name: "LineAdsorption",
  data() {
    return {
    };
  },
  mounted() {
    window.lineAdsorption = this;
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const el = this.$el,
        c = this.$refs.canvas,
        w = el.clientWidth,
        h = el.clientHeight;

      c.setAttribute("width", w + "px");
      c.setAttribute("height", h + "px");

      this.adsorption = new Adsorption(c);
    },

    onEvent(e) {
      
    }
  }
};
</script>

<style scoped>
.line-adsorption {
  position: relative;
  height: 100%;
  overflow: hidden;
}
</style>
