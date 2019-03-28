<template>
  <div>
    <game v-if="isReady"></game>
  </div>
</template>

<script>
import Game from "@/components/game/Game";

export default {
  components: {
    game: Game
  },
  data() {
    return {
      isReady: false
    };
  },
  mounted() {
    this.loadJs(["stats.min.js", "three.min.js", "tween.min.js"], () => {
      this.loadJs(["gltf-loader.js"], () => {
        this.isReady = true;
      });
    });
  },
  methods: {
    loadJs(jsNames, call) {
      let count = 0;
      const head = document.head;
      jsNames.forEach(jsName => {
        const script = document.createElement("SCRIPT");
        script.type = "text/javascript";
        script.src = "./static/js/" + jsName;
        script.onload = () => {
          count++;
          if (count === jsNames.length) {
            call && call();
          }
          script.onload = null;
        };
        head.appendChild(script);
      });
    }
  }
};
</script>

<style scoped>
div {
  height: 100%;
}
</style>
