<template>
  <div v-show="visible" class="music-box-mask">
    <div class="music-box">
      <!-- 音乐名 -->
      <div class="music-name">{{ name }}</div>
      <!-- 音乐功能按钮 -->
      <div class="music-options">
        <button class="music-previous" :disabled="previousDisabled" @click="onPlayNext(false)"></button>
        <button :class="{'music-toggle': true, 'music-play': isPlaying, 'music-pause': !isPlaying }"
          @click="onTogglePlay(null, $event)"></button>
        <button class="music-next" :disabled="nextDisabled" @click="onPlayNext(true)"></button>
      </div>
      <!-- 播放实体 -->
      <audio ref="audio" :src="musicSrc" hidden
        @timeupdate="handleTimeUpdate" @canplay="handleCanPlay" @ended="handleEnded">
      </audio>
      <!-- 播放进度 -->
      <div class="music-progress">
        <div class="music-progress__outer" @click="onClickProgress">
          <div class="music-progress__inner" :style="{ width: progress }"></div>
        </div>
        <div class="music-time">
          <div class="left">{{ currentTime | minuteFilter }}</div>
          <div class="right">{{ totalTime | minuteFilter }}</div>
        </div>
      </div>
      <!-- 关闭 -->
      <div class="music-box-close">
        <button @click="$emit('update:visible', false)">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicBox',

  props: {
    visible: {
      type: Boolean,
      default: true
    },
    /**
     * 播放的音乐列表
     * eg: [{contentID: 0, transferstate: 3, contentName: 'victory.mp3', presentURL: 'http://mp3.music.cn/pure/vicotry.mp3'}]
     */
    list: {
      type: Array,
      default () {
        return [
            {contentID: 0, transferstate: 3, contentName: 'test from sghen.mp3', presentURL: 'http://www.sghen.cn/peotry/media/%E5%BE%90%E9%B2%A4%20-%20%E9%95%9C%E6%B9%96.ec79cf7a.mp3'},
            {contentID: 0, transferstate: 3, contentName: 'test from caiyun.mp3', presentURL: 'http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D960&root=/mnt/wfs65&pt=/de3/fb&fileid=K8de3fbed4c88676f1a8f3349bc10e03bb.mp3&type=5&ui=15625045984&ci=0111TyOUz4gZ06420200317110301r9s&cn=%E6%B8%85%E6%BC%AA-%E5%87%BA%E5%A1%9E%E6%AD%8C&ct=2&time=1584415267&exp=12&code=AAE37182B67D5DCA942CFAE81062753961E18A117E8004A5CA7891B06C9A9222&ec=0'}
        ]
      }
    },
    initIndex: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      hasUserAction: false, // 是否有人为点击播放动作
      index: 0,
      musicSrc: '',
      name: '',
      progress: '0%',
      currentTime: 0,
      totalTime: 0,
      isPlaying: false,
      previousDisabled: false,
      nextDisabled: false
    }
  },

  watch: {
    visible (v) {
      if (v) {
        this.index = this.initIndex
        this.setMusic()
      } else {
        this.onTogglePlay(false)
      }
    }
  },

  filters: {
    /**
     * @description 分钟时间格式化
     */
    minuteFilter (v) {
      let m = Math.floor(v / 60)
      let s = Math.floor(v % 60)
      m = '' + m
      s = '' + s
      if (m.length === 1) {
        m = '0' + m
      }
      if (s.length === 1) {
        s = '0' + s
      }
      return m + ':' + s
    }
  },

  mounted () {
    window.musicBox = this
  },

  methods: {
    /**
     * @description 音频当前播放时间回调事件
     * @param {Event} e
     */
    handleTimeUpdate (e) {
      const duration = e.target.duration || 0 // 优先于handleCanPlay调用一次
      const currentTime = e.target.currentTime
      const ratio = (currentTime / duration * 100).toFixed(2)

      this.totalTime = duration
      this.currentTime = currentTime
      this.progress = ratio + '%'
    },
    /**
     * @description 音频可播放回调事件
     * @param {Event} e
     */
    handleCanPlay (e) {
      // wap端需要手动点击播放
      this.totalTime = e.target.duration || 0
      this.hasUserAction && this.onTogglePlay(true)
    },
    handleEnded (e) {
      this.onPlayNext(true, true)
    },

    /**
     * @description 点击进度条某个位置
     * @param {Event} e
     */
    onClickProgress (e) {
      const rect = e.target.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width

      const audio = this.$refs.audio
      audio.currentTime = ratio * audio.duration
    },
    /**
     * @description 设置播放音乐
     */
    setMusic () {
      const music = this.list[this.index]
      if (!music) {
        return
      }
      this.previousDisabled = this.index === 0
      this.nextDisabled = this.index === (this.list.length - 1)
      // transferstate：表明文件转码的状态
      // 0：转码中  1：转码失败  2：待审核  3：正常  4：被屏蔽
      const textMap = {
        0: '音频转码中，请稍后再试',
        1: '转码失败，请反馈',
        2: '音频待审核',
        4: '音频被屏蔽'
      }
      if (textMap[music.transferstate]) {
        this.$toast(textMap[music.transferstate])
        if (music.transferstate === 0) {
          this.$emit('transfer', music)
        }
        return
      }
      // presentHURL, presentLURL, presentURL
      this.musicSrc = music.presentURL
      this.name = music.contentName
      this.isPlaying = false
      this.totalTime = 0
      this.currentTime = 0
      this.progress = 0
      // 更改了src后要重新加载
      this.$refs.audio.load()
    },

    /**
     * @description 切换播放或暂停
     * @param {Boolean} forcePlay true为强制播放，false为强制暂停
     * @param {Event} e 用于判断是否为人为点击播放或暂停
     */
    onTogglePlay (forcePlay, e) {
      const audio = this.$refs.audio
      if (forcePlay === true) {
        audio.paused && audio.play()
      } else if (forcePlay === false) {
        !audio.paused && audio.pause()
      } else {
        audio.paused ? audio.play() : audio.pause()
      }
      this.isPlaying = !audio.paused
      if (e && e.target) {
        this.hasUserAction = true
      }
    },
    /**
     * @description 播放下一首或前一首
     * @param {Boolean} isNext 是否下一首还是前一首
     * @param {Boolean} hideToast 是否隐藏toast提示
     */
    onPlayNext (isNext, hideToast) {
      let index = this.index
      if (isNext) {
        index++
        if (index >= this.list.length) {
          !hideToast && this.$toast('已经是最后一首了')
          return
        }
      } else {
        index--
        if (index < 0) {
          !hideToast && this.$toast('已经是第一首了')
          return
        }
      }
      this.index = index
      this.setMusic()
    }
  }
}
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
  background:rgba(248, 249, 251, 1);
  border-radius: 4px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  button {
    padding: 0;
    outline: none;
  }

  .music-name {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    padding: 0 16px;
    text-align: center;
    color:rgba(51, 51, 51, 1);
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
      background-image: url('~@/assets/image/audio/audio_previous.png');
      &:disabled {
        background-image: url('~@/assets/image/audio/audio_previous_disabled.png');
      }
    }
    .music-toggle {
      width: 45px;
      height: 45px;
      margin: 0 42px;
    }
    .music-play {
      background-image: url('~@/assets/image/audio/audio_play.png');
    }
    .music-pause {
      background-image: url('~@/assets/image/audio/audio_pause.png');
    }
    .music-next {
      width: 22px;
      height: 22px;
      background-image: url('~@/assets/image/audio/audio_next.png');
      &:disabled {
        background-image: url('~@/assets/image/audio/audio_next_disabled.png');
      }
    }
  }

  .music-progress {
    padding: 3px 20px 6px;
    .music-progress__outer {
      height: 3px;
      margin-bottom: 4px;
      background:rgba(49, 129, 249, 0.1);
    }
    .music-progress__inner {
      height: 100%;
      position: relative;
      background:rgba(49, 129, 249, 1);
      pointer-events: none;
      &::after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background:rgba(49, 129, 249, 1);
        position: absolute;
        right: -4px;
        top: -2.5px;
      }
    }
  }

  .music-time {
    display: flex;
    flex-direction: row;
    height: 14px;
    font-size: 10px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color:rgba(102, 102, 102, 1);
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
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color:rgba(49, 129, 249, 1);
      line-height: 22px;
    }
  }
}
</style>
