<template>
  <div id="app" ref="canvas">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "App",
  mounted() {
    window.app = this;
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
