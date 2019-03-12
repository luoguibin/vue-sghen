<template>
  <div class="mix-test">

    <div>
      <p>DMixTest test</p>
      <button @click="onToggleFullScreen()">isFullScreen = {{isFullScreen}}</button>
    </div>

    <div>
      <button @click="show = !show">
        Toggle render
      </button>
      <transition name="slide-fade">
        <p v-if="show">hello</p>
      </transition>
    </div>

  </div>
</template>

<script>
import * as ScreenUtil from "../../common/utils/screen-util";

export default {
  name: "DMixTest",
  data() {
    return {
      isFullScreen: false,
      show: false
    };
  },
  created() {
    console.log("created()");
  },
  mounted() {
    this.isFullScreen = ScreenUtil.isFullScreen();

    this.onFullScreenChange = this.onFullScreenChange.bind(this);
    document.addEventListener("fullscreenchange", this.onFullScreenChange);
  },
  methods: {
    onToggleFullScreen() {
      if (ScreenUtil.isFullScreen()) {
        ScreenUtil.exitFullscreen();
      } else {
        ScreenUtil.requestFullscreen(this.$el);
      }
    },
    onFullScreenChange(e) {
      this.isFullScreen = ScreenUtil.isFullScreen();
      if (this.isFullScreen) {
        this.showMask = true;
      } else {
        this.showMask = false;
      }
      console.log("fullscreenchange() " + this.isFullScreen);
    }
  },
  destroyed() {
    document.removeEventListener("fullscreenchange", this.onFullScreenChange);
  }
};
</script>

<style scoped>
.mix-test {
  background-color: white;
  position: relative;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 3.3s ease;
}
.slide-fade-leave-active {
  transition: all 3.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  /* transform: translateX(100px); */
  /* opacity: 0; */
  background-color: brown;
}
</style>