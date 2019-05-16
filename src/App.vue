<template>
  <div id="app" ref="canvas">
    <router-view/>
  </div>
</template>

<script>
import CanvasNest from "canvas-nest.js";

export default {
  name: "app",
  mounted() {
    window.app = this;

    // Using config rendering effect at 'element'.
    const cn = new CanvasNest(this.$refs.canvas, {
      color: "#148acf",
      count: 88,
      zIndex: 0
    });
    this.$once("destroy", () => {
      cn.destroy();
    });
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

html,
body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: "SimSun";
  background-image: url("./assets/img/qiangzhi01.gif");
  background-repeat: repeat;
}
</style>
