<template>
  <div id="app" ref="canvas">
    <game v-if="isLogin"></game>
    <login v-else></login>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "app",
  components: {
    login: () => import("./components/login"),
    game: () => import(/* webpackChunkName: "game" */"./components/game")
  },

  data() {
    return {};
  },

  mounted() {
    window.app = this;
  },

  computed: {
    isLogin() {
      if (this.userInfo.token) {
        return true;
      } else {
        return false;
      }
    },

    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  methods: {}
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
}
</style>
