<template>
  <div class="music-container">
    <button @click="visible = true">显示</button>

    <div v-show="visible" class="music-box-mask">
      <div class="music-box">
        <!-- 音乐名 -->
        <div class="music-name">{{ audioName }}</div>
        <!-- 音乐功能按钮 -->
        <div class="music-options">
          <button class="music-previous" :disabled="previousDisabled" @click="onPlayNext(false)"></button>
          <button
            :class="{'music-toggle': true, 'music-play': isPlaying, 'music-pause': !isPlaying }"
            @click="onTogglePlay($event)"
          ></button>
          <button class="music-next" :disabled="nextDisabled" @click="onPlayNext(true)"></button>
        </div>
        <!-- 播放实体 -->
        <audio
          v-if="audioSrc"
          ref="audio"
          :src="audioSrc"
          hidden
          @loadstart="handleLoadStart"
          @durationchange="handleDurationChange"
          @loadedmetadata="handleLoadedMetadata"
          @loadeddata="handleLoadedData"
          @progress="handleProgress"
          @canplay="handleCanPlay"
          @canplaythrough="handlePlayThrough"
          @play="handlePlay"
          @playing="handlePlaying"
          @timeupdate="handleTimeUpdate"
          @pause="handlePause"
          @ended="handleEnded"
          @error="handleError"
        ></audio>
        <!-- 播放进度 -->
        <div class="music-progress">
          <div
            class="music-progress__outer"
            ref="progress"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div class="music-progress__inner" :style="progressStyle"></div>
          </div>
          <div class="music-time">
            <div class="left">{{ audioCurrentTime | minuteFilter }}</div>
            <div class="right">{{ audioDuration | minuteFilter }}</div>
          </div>
        </div>
        <!-- 关闭 -->
        <div class="music-box-close">
          <button @click="visible = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicBox",

  props: {
    /**
     * 播放的音乐列表
     * eg: [{contentID: 0, transferstate: 3, contentName: 'victory.mp3', presentURL: 'http://mp3.music.cn/pure/vicotry.mp3'}]
     */
    list: {
      type: Array,
      default() {
        return [
          {
            contentID: 0,
            transferstate: 3,
            contentName: "test from sghen.mp3",
            presentURL:
              "http://www.sghen.cn/peotry/media/%E5%BE%90%E9%B2%A4%20-%20%E9%95%9C%E6%B9%96.ec79cf7a.mp3"
          },
          {
            contentID: 0,
            transferstate: 3,
            contentName: "test from caiyun.mp3",
            presentURL:
              "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D960&root=/mnt/wfs65&pt=/de3/fb&fileid=K8de3fbed4c88676f1a8f3349bc10e03bb.mp3&type=5&ui=15625045984&ci=0111TyOUz4gZ06420200317110301r9s&cn=%E6%B8%85%E6%BC%AA-%E5%87%BA%E5%A1%9E%E6%AD%8C&ct=2&time=1584415267&exp=12&code=AAE37182B67D5DCA942CFAE81062753961E18A117E8004A5CA7891B06C9A9222&ec=0"
          }
        ];
      }
    },
    initIndex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      visible: false,
      hasUserAction: false, // 是否有人为点击播放动作
      index: 0,
      audioSrc: "",
      audioName: "",
      audioCurrentTime: 0,
      audioDuration: 0,
      isPlaying: false,
      previousDisabled: false,
      nextDisabled: false
    };
  },

  watch: {
    visible(v) {
      if (v) {
        this.index = this.initIndex;
        this.setMusic();
      } else {
        this.pauseAudio();
      }
    }
  },

  computed: {
    progressStyle() {
      let ratio = 0;
      if (this.audioDuration > 0) {
        ratio = this.audioCurrentTime / this.audioDuration;
      }
      return { width: (ratio * 100).toFixed(2) + "%" };
    }
  },

  filters: {
    /**
     * @description 分钟时间格式化
     */
    minuteFilter(v) {
      let m = Math.floor(v / 60);
      let s = Math.floor(v % 60);
      m = "" + m;
      s = "" + s;
      if (m.length === 1) {
        m = "0" + m;
      }
      if (s.length === 1) {
        s = "0" + s;
      }
      return m + ":" + s;
    }
  },

  mounted() {
    window.musicBox = this;

    setTimeout(() => {
      this.visible = true;
    }, 5000);
  },

  methods: {
    handleLoadStart() {
      console.log("handleLoadStart");
    },
    handleDurationChange(e) {
      this.audioDuration = e.target.duration;
      console.log("handleDurationChange", this.audioDuration);
    },
    handleLoadedMetadata() {
      console.log("handleLoadedMetadata");
    },
    handleLoadedData() {
      console.log("handleLoadedData");
    },
    handleProgress() {
      console.log("handleProgress");
    },
    /**
     * @description 音频可播放回调事件
     * @param {Event} e
     */
    handleCanPlay(e) {
      // wap端需要手动点击播放
      console.log("handleCanPlay");
      this.hasUserAction && this.playAudio();
    },
    handlePlayThrough() {
      console.log("handlePlayThrough");
    },
    /**
     * @description 监听音频是否被暂停，主要用于解决第三方应用引起
     */
    handlePlay() {
      console.log("handlePlay");
      this.isPlaying = true;
    },
    handlePlaying() {
      console.log("handlePlaying");
    },
    /**
     * @description 音频当前播放时间回调事件
     * @param {Event} e
     */
    handleTimeUpdate(e) {
      // 正在拖动进度条
      if (this.previousTouch) {
        return;
      }
      this.audioCurrentTime = e.target.currentTime;
      // console.log('handleTimeUpdate', this.audioCurrentTime)
    },
    /**
     * @description 监听音频是否被暂停，主要用于解决第三方应用引起
     */
    handlePause() {
      console.log("handlePause");
      this.isPlaying = false;
    },
    handleEnded(e) {
      console.log("handleEnded");
      this.onPlayNext(true);
    },
    handleError(e) {
      console.log("handleError", e.target.error);
      // networkState
      // 0 = NETWORK_EMPTY - 音频尚未初始化
      // 1 = NETWORK_IDLE - 音频是活动的且已选取资源，但并未使用网络
      // 2 = NETWORK_LOADING - 浏览器正在下载数据
      // 3 = NETWORK_NO_SOURCE - 未找到音频来源
      this.pauseAudio();
      if (!navigator.onLine) {
        alert("网络异常，请检查");
        return;
      }
    },

    onTouchStart(e) {
      if (this.audioDuration <= 0) {
        return;
      }
      if (!this.touchmoveHandle) {
        this.touchmoveHandle = e => {
          this.onTouchMove(e);
        };
      }
      this.pauseAudio();
      const progress = this.$refs.progress;
      progress.addEventListener("touchmove", this.touchmoveHandle);
      const rect = progress.getBoundingClientRect();
      this.progressRect = rect;
      const touch = e.touches[0];
      this.previousTouch = touch;
      const ratio = (touch.clientX - rect.left) / rect.width;
      this.audioCurrentTime = ratio * this.audioDuration;
    },
    onTouchMove(e) {
      const touch = e.touches[0];
      const rect = this.progressRect;
      this.previousTouch = touch;
      let ratio = (touch.clientX - rect.left) / rect.width;
      ratio = Math.max(ratio, 0);
      ratio = Math.min(ratio, 1);
      this.audioCurrentTime = ratio * this.audioDuration;
    },
    onTouchEnd(e) {
      if (this.previousTouch) {
        this.previousTouch = null;
        this.$refs.audio.currentTime = this.audioCurrentTime;
        this.$refs.progress.removeEventListener("touchmove", this.touchmoveHandle);
        this.playAudio();
      }
    },
    /**
     * @description 设置播放音乐
     */
    setMusic() {
      const music = this.list[this.index];
      if (!music) {
        return;
      }
      this.previousDisabled = this.index === 0;
      this.nextDisabled = this.index === this.list.length - 1;

      this.audioSrc = music.presentURL;
      this.audioName = music.contentName;
      this.audioDuration = 0;
      this.audioCurrentTime = 0;
      this.isPlaying = false;

      // 更改了src后要重新加载
      this.$nextTick(() => {
        this.$refs.audio.load();
        window.testAudio = this.$refs.audio;
      });
    },

    /**
     * @description 切换播放或暂停
     * @param {Boolean} forcePlay true为强制播放，false为强制暂停
     * @param {Event} e 用于判断是否为人为点击播放或暂停
     */
    onTogglePlay(e) {
      this.isPlaying ? this.pauseAudio() : this.playAudio();
      if (e && e.target) {
        this.hasUserAction = true;
      }
    },
    /**
     * @description 播放下一首或前一首
     * @param {Boolean} isNext 是否下一首还是前一首
     */
    onPlayNext(isNext) {
      let index = this.index;
      if (isNext) {
        index++;
      } else {
        index--;
      }
      this.index = index;
      this.setMusic();
    },

    playAudio() {
      // readyState
      // 0 = HAVE_NOTHING - 没有关于音频是否就绪的信息
      // 1 = HAVE_METADATA - 关于音频就绪的元数据
      // 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
      // 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
      // 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
      const audio = this.$refs.audio;
      if (!audio.paused) {
        return;
      }
      if (audio.readyState > audio.HAVE_NOTHING && !audio.error) {
        audio.play();
        this.isPlaying = true;
      } else {
        alert("readyState=" + audio.readyState);
        audio.load();
      }
    },

    pauseAudio() {
      const audio = this.$refs.audio;
      if (audio.paused) {
        return;
      }
      audio.pause();
      this.isPlaying = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.music-box-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.music-box {
  width: 291px;
  display: inline-block;
  padding-top: 16px;
  background: rgba(248, 249, 251, 0.5);
  box-shadow: 0 0 19px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  button {
    padding: 0;
    outline: none;
    background-color: transparent;
    background-size: 100% 100%;
    border: none;
  }

  .music-name {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    padding: 0 16px;
    text-align: center;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .music-options {
    margin: 14px 0 16px 0;
    text-align: center;
    button {
      vertical-align: middle;
    }
    .music-previous {
      width: 22px;
      height: 22px;
      background-image: url("~@/assets/image/audio/audio_previous.png");
      &:disabled {
        background-image: url("~@/assets/image/audio/audio_previous_disabled.png");
      }
    }
    .music-toggle {
      width: 45px;
      height: 45px;
      margin: 0 42px;
    }
    .music-play {
      background-image: url("~@/assets/image/audio/audio_play.png");
    }
    .music-pause {
      background-image: url("~@/assets/image/audio/audio_pause.png");
    }
    .music-next {
      width: 22px;
      height: 22px;
      background-image: url("~@/assets/image/audio/audio_next.png");
      &:disabled {
        background-image: url("~@/assets/image/audio/audio_next_disabled.png");
      }
    }
  }

  .music-progress {
    padding: 8px 20px 6px;
    .music-progress__outer {
      height: 8px;
      margin-bottom: 4px;
      background: rgba(49, 129, 249, 0.1);
    }
    .music-progress__inner {
      height: 100%;
      position: relative;
      background: rgba(49, 129, 249, 1);
      pointer-events: none;
      &::after {
        content: "";
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgba(49, 129, 249, 1);
        position: absolute;
        right: -8px;
        top: -4px;
      }
    }
  }

  .music-time {
    display: flex;
    flex-direction: row;
    height: 14px;
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 14px;
    .left {
      flex: 1;
      text-align: left;
    }
    .right {
      flex: 1;
      text-align: right;
    }
  }

  .music-box-close {
    width: 100%;
    padding: 15px 0 16px;
    border-top: 1px solid rgba(223, 223, 223, 0.8);
    text-align: center;
    button {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(49, 129, 249, 1);
      line-height: 22px;
    }
  }
}
</style>
