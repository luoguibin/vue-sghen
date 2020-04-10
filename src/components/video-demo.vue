<template>
  <div class="video-demo">
    <!-- 视频区域 -->
    <div class="video-wrapper" ref="videoWrapper">
      <video
        ref="video"
        preload="auto"
        :poster="require('@/assets/img/icon.png')"
        webkit-playsinline="true"
        playsinline="true"
        x-webkit-airplay="allow"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
      >
        <source :src="mp4Path" type="video/mp4" />
        <source :src="oggPath" type="video/ogg" />您的浏览器不支持 HTML5 video 标签。
      </video>

      <!-- 视频控件 -->
      <div class="video-controls">
        <div class="video-controls-top" v-show="controlsVisble">
          <p @click="onClickTitle">大白与蝴蝶.mp4</p>
        </div>
        <div class="video-controls-middle" @click="onControlMiddle"></div>
        <div class="video-controls-bottom" v-show="controlsVisble">
          <div class="video-controls-btns">
            <i
              @click="togglePlay()"
              :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"
            ></i>
          </div>
          <div class="video-controls-progress" @click="onProgressClick" ref="progressWrapper">
            <div :style="{ width: timeProgress }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoDemo",

  props: {},

  data() {
    return {
      mp4Path: "https://www.runoob.com/try/demo_source/mov_bbb.mp4",
      oggPath: "https://www.runoob.com/try/demo_source/mov_bbb.ogg",
      isPlaying: false,

      controlsVisble: true,
      controlsClickTime: Date.now(),
      timeProgress: 0,
      videoFullscreen: 0 // -1~0：退出全屏   1~2进入全屏
    };
  },

  created() {
    console.log("VideoDemo created()");
    window.videoDemo = this;
  },

  mounted() {
    const video = this.$refs.video;
    video.addEventListener("timeupdate", e => {
      const ratio = video.currentTime / video.duration;
      this.timeProgress = (ratio * 100).toFixed(2) + "%";
    });
  },

  activited() {},
  deactivied() {},

  updated() {},

  methods: {
    onClickTitle() {
      if (this.isFullscreen) {
        this.exitFullscreen()
      } else {
        this.fullScreen()
      }
    },
    //全屏
    fullScreen() {
      this.isFullscreen = true
      const element = this.$refs.videoWrapper;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },

    //退出全屏
    exitFullscreen() {
      this.isFullscreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    togglePlay() {
      const video = this.$refs.video;
      // console.log(video.readyState, video.paused)

      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        if (this.playTimer) {
          return;
        }
        this.playTimer = setTimeout(() => {
          this.playTimer = null;
          this.togglePlay();
        }, 300);
        return;
      }
      if (video.paused) {
        video.play();
        this.isPlaying = true;
      } else {
        video.pause();
        this.isPlaying = false;
      }
    },

    onControlMiddle(e) {
      if (this.controlsTimer) {
        clearTimeout(this.controlsTimer);
        this.controlsTimer = null;
      }
      this.controlsTimer = setTimeout(() => {
        // 单击
        console.log("onControlMiddle 单击");
        this.controlsTimer = null;
        this.controlsVisble = !this.controlsVisble;
      }, 300);

      const nowTime = Date.now();
      if (nowTime - this.controlsClickTime < 300) {
        // 双击
        console.log("onControlMiddle 双击");
        if (this.controlsTimer) {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = null;
        }

        console.log(this.videoFullscreen, document.fullscreenElement);
        if (this.videoFullscreen === 2) {
          this.videoFullscreen = -1;
          document.exitFullscreen().then(e => {
            this.videoFullscreen = 0;
          });
        } else if (this.videoFullscreen === 0) {
          this.videoFullscreen = 1;
          this.$refs.videoWrapper.requestFullscreen().then(e => {
            this.videoFullscreen = 2;
          });
        }

        // 禁止三次快速点击变为两次双击
        this.controlsClickTime = nowTime - 301;
        return;
      }
      this.controlsClickTime = nowTime;

      this.resetControlsHideTimer();
    },

    onProgressClick(e) {
      const rect = this.$refs.progressWrapper.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const currentTime = ratio * this.$refs.video.duration;
      this.$refs.video.currentTime = currentTime;
      this.timeProgress = (ratio * 100).toFixed(2) + "%";
    },

    resetControlsHideTimer() {
      if (this.controlsHideTimer) {
        clearTimeout(this.controlsHideTimer);
        this.controlsHideTimer = null;
      }
      this.controlsHideTimer = setTimeout(() => {
        // this.controlsVisble = false
        this.controlsHideTimer = null;
      }, 5000);
    }
  },

  filters: {},

  watch: {},

  destroyed() {}
};
</script>

<style lang="scss" scoped>
.video-demo {
  height: 100%;
  overflow: hidden;
  .video-wrapper {
    position: relative;
    text-align: center;
    background-color: black;
    overflow: hidden;

    video {
      width: 100%;
      max-width: 1024px;
      padding: 20px;
      box-sizing: border-box;
    }

    .video-controls {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      box-sizing: border-box;
      color: white;

      .video-controls-top {
        padding: 20px;
        box-sizing: border-box;
      }
      .video-controls-middle {
        flex: 1;
      }
      .video-controls-bottom {
        padding: 20px;
        box-sizing: border-box;
      }

      .video-controls-progress {
        margin-top: 10px;
        background-color: slategray;
        cursor: pointer;
        div {
          position: relative;
          border-radius: 2px;
          height: 4px;
          background-color: royalblue;
          &::after {
            content: "";
            width: 10px;
            height: 10px;
            top: -3px;
            right: -3px;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
            background-color: royalblue;
          }
        }
      }
      .video-controls-btns {
        i {
          cursor: pointer;
        }
      }
    }
  }
}
</style>