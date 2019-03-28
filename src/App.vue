<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
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
  font-family: "SimSun";
  background-image: url('./assets/img/qiangzhi00.jpg');
  background-repeat: repeat;
}
</style>
