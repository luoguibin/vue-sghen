<template>
  <div id="app" ref="canvas">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CanvasNest from "canvas-nest.js";
import tooltip from "./mixins/tooltip";

export default {
  name: "app",
  mixins: [tooltip],
  mounted() {
    window.app = this;

    // Using config rendering effect at 'element'.
    const cn = new CanvasNest(this.$refs.canvas, {
      color: "20,155,250",
      count: 88,
      zIndex: 0
    });
    this.$once("destroy", () => {
      cn.destroy();
    });

    const infoStr = sessionStorage.getItem("sghen_user_info");
    if (infoStr) {
      this.setUserInfo(JSON.parse(infoStr));
    }
  },
  methods: {
    ...mapActions({
      setUserInfo: "setUser"
    })
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
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  background-image: url("./assets/img/qiangzhi01.gif");
  background-repeat: repeat;
}
</style>
