<template>
  <div>
    <game v-if="isReady"></game>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      isReady: false
    };
  },
  created() {
    this.$NProgress.start();
    this.defaultContextmenu = document.oncontextmenu;
    document.oncontextmenu = function () {
      return false;
    }
  },
  mounted() {
    window.homeGame = this;
    this.loadJs(["stats.min.js", "three.min.js", "tween.min.js"], () => {
      this.loadJs(["gltf-loader.js"], () => {
        import(/* webpackChunkName: "game" */ "@/components/game/game")
          .then(o => {
            Vue.component("game", o.default);
            this.isReady = true;
          })
          .catch(e => {
            this.$appTip("@/components/game/game 加载失败");
            console.log(e);
          });
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
  },
  beforeDestroy() {
    document.oncontextmenu = this.defaultContextmenu;
  }
};
</script>

<style scoped>
div {
  height: 100%;
}
</style>
