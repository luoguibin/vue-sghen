<template>
  <div class="video-player">
    <div class="video-player-header">
      <div class="back--title">
        <img @click="goBack" src="@/assets/image/audio/audio_previous.png" alt />
        <p class="video-name" @click="onClickTitle">{{videoName}}</p>
      </div>
      <div>
        <input
          v-model="videoURL0"
          style="width: calc(100% - 60px);line-height: 25px; display: inline-block; padding: 0 10px; box-sizing: border-box;"
        />
        <button
          @click="onResetLoad()"
          style="line-height: 25px; width: 60px;box-sizing: border-box;"
        >加载</button>
      </div>
    </div>

    <div ref="wrapper" :class="{'video-player-wrapper': true, 'video-hidden': !videoReady }">
      <video
        ref="video"
        :src="videoURL"
        playsinline="true"
        x-webkit-airplay="true"
        x5-playsinline="true"
        webkit-playsinline="true"
        preload="auto"
        @loadeddata="handleLoadedData"
        @waiting="handleWaiting"
        @canplay="hanldeCanPlay"
        @play="hanlePlay"
        @playing="handlePlaying"
        @error="handleError"
        @loadstart="handleLoadStart"
        @durationchange="handleDurationChange"
        @loadedmetadata="handleLoadedMetadata"
        @progress="handleProgress"
        @canplaythrough="handlePlayThrough"
      ></video>
      <div class="video-player-poster" v-show="posterVisible">
        <img
          :class="{'poster': true, 'img-hidden': !isPosterLoaded}"
          :src="videoPosterURL"
          @error="isPosterLoaded = false"
          @load="isPosterLoaded = true"
        />
        <img
          class="play"
          v-show="videoReady"
          @click="onInitPlay"
          src="@/assets/image/audio/audio_pause.png"
        />
      </div>
    </div>

    <div class="video-player-tip" v-show="tipVisible">
      <p>
        加载失败，请
        <span @click="onReload">重新加载</span>
      </p>
    </div>

    <div v-if="true" class="log">
      <div v-html="logMsg"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",

  data() {
    return {
      videoReady: false,
      videoName: "big_buck_bunny.mp4",
      videoURL: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
      videoURL0: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
      videoPosterURL:
        "http://218.104.127.194:2414/storageWeb/servlet/GetFileByURLServlet?root=/mnt/D999&fileid=mz74bda2ec99358cab89c7625ff8c28e6c.mp4&ct=3&type=1&code=A16BCA895B99F451D0F77AFC92EC9339033717F750518E923756F3AC15356D28&account=MTU2MjUwNDU5ODQ=&p=0&ui=TT11jJpQI00x&ci=TT11jJpQI00x0042020040816524000h&cn=mov_bbb&oprChannel=10000000&dom=D888",
      tipVisible: false,
      posterVisible: true,
      isPosterLoaded: true,
      hasUserAction: false,
      isFullScreen: false,
      logMsg: "create\n"
    };
  },

  mounted() {
    window.videoPlayer = this;
    // this.$loading()
    this.$refs.video.load();

    this.$el.parentElement.style.padding = "0";
  },

  methods: {
    goBack() {
      if (history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/main");
      }
    },
    onInitPlay(e) {
      const video = this.$refs.video;
      video.play();
      this.posterVisible = false;
      this.hasUserAction = !!e;

      // 进入全屏，设置状态
      video.addEventListener(
        "x5videoenterfullscreen",
        () => {
          this.logMsg += "x5videoenterfullscreen\n";
          this.isFullScreen = true;
        },
        false
      );

      // 退出全屏时，清空状态
      video.addEventListener(
        "x5videoexitfullscreen",
        () => {
          this.logMsg += "x5videoexitfullscreen\n";
          this.isFullScreen = false;
        },
        false
      );

      // this.$el.requestFullscreen().then(resp => {
      //   console.log(resp)
      // }).catch(err => {
      //   console.log(err)
      // })
    },

    onResetLoad(e) {
      this.videoURL = this.videoURL0;
      this.onReload(e);
    },

    onReload(e) {
      if (!this.isOnline()) {
        alert("网络异常，请稍后重试");
        return;
      }
      this.tipVisible = false;
      this.posterVisible = true;
      this.videoReady = false;
      // this.$loading()
      this.hasUserAction = !!e;
      this.$refs.video.load();
    },

    handleLoadStart() {
      // console.log('handleWaiting', e)
      this.logMsg += "loadstart\n";
    },
    handleDurationChange() {
      // console.log('handleWaiting', e)
      this.logMsg += "duration change\n";
    },
    handleLoadedMetadata() {
      // console.log('handleWaiting', e)
      this.logMsg += "loadedmetadata\n";
    },
    handleProgress() {
      // console.log('handleWaiting', e)
      this.logMsg += "pregress\n";
    },
    handlePlayThrough() {
      // console.log('handleWaiting', e)
      this.logMsg += "playthrough\n";
    },
    handleWaiting() {
      // console.log('handleWaiting', e)
      this.logMsg += "waiting\n";
    },
    handleLoadedData() {
      // console.log('handleLoadedData', e)
      this.logMsg += "loadeddata\n";
    },
    hanldeCanPlay() {
      // console.log('hanldeCanPlay', e)
      this.logMsg += "canplay\n";
      const video = this.$refs.video;
      if (!this.videoReady) {
        video.setAttribute("controls", true);
        // this.$loading.hide()
        this.videoReady = true;
      }
      if (video.paused && this.hasUserAction) {
        video.play();
      }
    },
    hanlePlay() {
      // console.log('hanlePlay', e)
      this.logMsg += "play\n";
    },
    handlePlaying() {
      // console.log('handlePlaying', e)
      this.logMsg += "playing\n";
    },
    handleError(e) {
      const error = e.target.error;
      this.logMsg += `error ${JSON.stringify(error)}\n`;
      // 1 = MEDIA_ERR_ABORTED - 取回过程被用户中止
      // 2 = MEDIA_ERR_NETWORK - 当下载时发生错误
      // 3 = MEDIA_ERR_DECODE - 当解码时发生错误
      // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持音频/视频
      if (error.code > 1) {
        if (!this.isOnline()) alert("网络异常，请稍后重试");
        this.tipVisible = true;
      }
      // this.$loading.hide()
      // console.log('handleError', error)
    },
    onClickTitle() {},
    isOnline() {
      return navigator.onLine;
    }
  }
};
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  height: 100%;
  background-color: black;

  .video-hidden {
    video {
      opacity: 0;
    }
  }

  .img-hidden {
    opacity: 0;
  }

  .video-player-header {
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 29999;
    background: linear-gradient(rgba(0, 0, 0, 0.5), transparent);

    .back--title {
      padding: 0 1.6rem;
      display: flex;
      align-items: center;
      height: 4.4rem;
      box-sizing: border-box;
    }
    img {
      display: inline-block;
      width: 2rem;
    }
    .video-name {
      flex: 1;
      color: #fff;
      font-size: 1.6rem;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 2rem;
    }
  }

  .video-player-wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 21rem;
    transform: translate(-50%, -50%);
    video {
      background: #111;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .video-player-poster {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    .poster {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 7rem;
      height: 7rem;
      transform: translate(-50%, -50%);
    }
  }

  .video-player-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;

    p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
      span {
        color: rgba(49, 129, 249, 0.8);
      }
    }
  }

  .log {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    overflow: auto;
    color: white;
    white-space: pre-line;
  }
}
.x5-fullscreen {
  // .video-player-header {
  //   display: none;
  // }
  // .video-player-wrapper {
  //   height: 100%;
  //   video {
  //     width: initial;
  //     height: initial;
  //     object-position: center top;
  //   }
  // }
}
</style>
