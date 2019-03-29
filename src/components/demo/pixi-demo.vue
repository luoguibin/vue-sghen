<template>
  <div class="chemistry"></div>
</template>

<script>
import HunterGame from "@/common/demo/pixi-demo/hunter-game";

export default {
  name: "PixiDemo",
  mounted() {
    const script = document.createElement("SCRIPT");
    script.onload = e => {
      this.game = new HunterGame(this);
      e.target.onload = null;
    };
    script.src = "static/js/pixis5.0.0.min.js";
    document.head.appendChild(script);
  },
  beforeDestroy() {
    this.game && this.game.release();
  }
};
</script>

<style scoped>
.chemistry {
  height: 100%;
  overflow: hidden;
  background-color: black;
}
</style>
