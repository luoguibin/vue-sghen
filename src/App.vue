<template>
  <div id="app">
    <app-tip></app-tip>
    <router-view/>
  </div>
</template>

<script>
import AppTip from "./components/AppTip";

export default {
  name: "app",
  components: {
    "app-tip": AppTip
  },
  mounted() {
    window.app = this;
    document.body.oncontextmenu = function() {
      return false;
    };
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
}
</style>
