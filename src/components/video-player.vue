<template>
  <div :class="{'video-player': true, 'video-player-fullscreen': isFullScreen}">
    <!-- 非全屏时的视频头部（全屏时的头部动态创建） -->
    <div class="video-player-header" v-show="outerHeaderVisible">
      <img @click="goBack" :src="backImgSrc" alt="">
      <p class="video-name">{{videoName}}</p>
    </div>

    <div ref="wrapper" class="video-player-wrapper"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import 'dplayer/dist/DPlayer.min.css'
import DPlayer from 'dplayer'

export default {
  name: 'VideoPlayer',

  data () {
    return {
      videoName: 'mov_bbb.mp4',
      isFullScreen: false,
      outerHeaderVisible: false,
      isControllerVisible: false,
      backImgSrc: require('@/assets/image/myPicture/goback.png')
    }
  },

  computed: {
    ...mapState({
      isOnline: (state) => state.isOnline
    })
  },

  mounted () {
    window.videoPlayer = this
    this.initDPlayer()
  },

  methods: {
    initDPlayer () {
      const videoObj = JSON.parse(sessionStorage.getItem('video'))
      if (!videoObj) {
        return
      }

      // presentURL  String 内容标准播放格式的URL地址
      // presentLURL String 内容流畅播放格式的URL地址
      // presentHURL String 内容高清播放格式的URL地址

      const URLKeys = [
        { key: 'presentURL', name: '标准' },
        { key: 'presentLURL', name: '流畅' },
        { key: 'presentHURL', name: '高清' }
      ]
      const quality = []
      URLKeys.forEach(o => {
        if (videoObj[o.key]) {
          quality.push({
            name: o.name,
            url: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4', // videoObj[o.key],
            type: 'auto'
          })
        }
      })
      if (!quality.length) {
        return
      }

      this.videoObj = videoObj
      // 初始化播放器实例及事件监听
      const dp = new DPlayer({
        container: this.$refs.wrapper,
        video: {
          quality,
          defaultQuality: 0,
          // pic: 'demo.png',
          thumbnails: videoObj.bigthumbnailURL
        },
        lang: 'zh-cn',
        autoplay: false,
        theme: '#b7daff',
        mutex: false
      })
      this.dp = dp
      this.$once('hook:beforeDestroy', () => {
        dp.destroy()
      })

      dp.on('fullscreen', () => {
        this.isFullScreen = true
        this.showHeader()
      })
      dp.on('fullscreen_cancel', () => {
        this.isFullScreen = false
        this.hideHeader()
      })
      dp.on('waiting', e => {
        console.log('waiting', e)
      })
      dp.on('error', e => {
        const error = dp.video.error
        this.videoErrorCode = error.code
        this.showCover()
        this.showHeader()
      })

      // 移动内部元素、添加自定义元素
      const template = dp.template
      const dplayerBarWrap = template.playedBarTime.parentElement
      const dplayerIconsRight = template.qualityButton.parentElement.parentElement
      const dplayerController = dplayerBarWrap.parentElement
      const ptime = template.ptime
      const dtime = template.dtime
      const timeParent = ptime.parentElement

      dplayerController.removeChild(dplayerIconsRight)
      dplayerController.removeChild(dplayerBarWrap)
      timeParent.removeChild(ptime)
      timeParent.removeChild(dtime)

      dplayerController.appendChild(ptime)
      dplayerController.appendChild(dplayerBarWrap)
      dplayerController.appendChild(dtime)
      dplayerController.appendChild(dplayerIconsRight)

      const header = document.createElement('DIV')
      header.classList.add('video-player-header')
      header.style.display = 'none'
      const headerImg = document.createElement('IMG')
      headerImg.src = this.backImgSrc
      headerImg.alt = ''
      headerImg.addEventListener('click', e => {
        this.goBack()
      })
      const headerP = document.createElement('P')
      headerP.classList.add('video-name')
      headerP.innerHTML = this.videoName

      header.appendChild(headerImg)
      header.appendChild(headerP)
      this.headerEl = header

      const coverView = document.createElement('DIV')
      coverView.classList.add('video-player-cover')
      const errorView = document.createElement('DIV')
      errorView.classList.add('video-error')
      const loadView = document.createElement('SPAN')
      loadView.addEventListener('click', e => {
        if (!this.isOnline) {
          this.$toast('网络异常，请稍后重试')
          return
        }
        dp.video.load()
        dp.play()
        this.hideCover()
      })
      loadView.innerHTML = '重新加载'
      errorView.appendChild(document.createTextNode('加载失败，请'))
      errorView.appendChild(loadView)
      coverView.appendChild(errorView)

      this.$refs.wrapper.appendChild(coverView)
      this.$refs.wrapper.appendChild(header)
      this.coverView = coverView

      // 监听控制版面显隐
      const _that = this
      const controller = dp.controller
      controller._show = controller.show
      dp.controller.show = function () {
        _that.isControllerVisible = true
        controller._show()
        _that.showHeader()
      }
      controller._hide = controller.hide
      dp.controller.hide = function () {
        _that.isControllerVisible = false
        controller._hide()
        _that.hideHeader()
      }

      this.resetVideoName()
    },
    showHeader () {
      if (!this.isFullScreen) {
        this.outerHeaderVisible = true
      } else {
        if (this.headerEl) {
          this.headerEl.style.display = 'flex'
        }
      }
    },
    hideHeader () {
      if (this.headerEl) {
        this.headerEl.style.display = 'none'
      }
      this.outerHeaderVisible = false
    },
    showCover () {
      this.coverView.style.display = 'initial'
    },
    hideCover () {
      this.coverView.style.display = ''
    },
    resetVideoName () {
      if (!this.videoObj) return
      const videoName = this.videoObj.contentName
      if (videoName.length > 16) {
        this.videoName = videoName.substring(0, 9) + '...' + videoName.substring(videoName.length - 9, videoName.length)
      } else {
        this.videoName = videoName
      }
    },
    goBack () {
      if (this.isFullScreen) {
        this.dp.fullScreen.cancel()
        return
      }
      if (history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/main')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  height: 100%;
  background-color: black;

  .video-player-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
  }
}
</style>

<style lang="scss">
.video-player {
  .video-player-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 4.4rem;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 101;
    box-sizing: border-box;
    background: linear-gradient(rgba(0,0,0,.5), transparent);
    padding: 0 1.6rem;
    img {
      display: inline-block;
      width: 2rem;
    }
    .video-name {
      flex: 1;
      color:#fff;
      font-size: 1.6rem;
      text-align: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      padding-right: 2rem;
    }
  }
  .video-player-cover {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: -1px;
    left: 0;
    width: 100%;
    // height: 100%;
    background-color: rgba(0, 0, 0, 1);
    z-index: 100;
    .video-error {
      position: relative;
      top: 50%;
      left: 50%;
      display: inline-block;
      height: 1.7rem;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color:rgba(255,255,255,0.8);
      line-height: 1.7rem;
      span {
        color: rgba(49, 129, 249, 0.8);
      }
    }
  }

  .dplayer {
    // .dplayer-controller-mask,

    .dplayer-time,
    .dplayer-setting,
    .dplayer-full-in-icon,
    .dplayer-comment-box {
      display: none !important;
    }

    .dplayer-controller {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0;
      .dplayer-icons-left, .dplayer-icons-right {
        position: initial;
      }
      .dplayer-bar-wrap {
        position: initial;
        flex: 1;
      }

      .dplayer-ptime, .dplayer-dtime {
        color: white;
        padding: 0 10px;
      }

      .dplayer-play-icon {
        width: 1.6rem;
        height: 1.6rem;
        margin: 0.8rem 1rem 0;
        background-size: 100% 100%;
        background-image: url('~@/assets/image/myVideo/video_play_2x.png');
        svg {
          display: none;
        }
      }
    }

    .dplayer-full-icon {
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 1rem;
      background-size: 100% 100%;
      background-image: url('~@/assets/image/myVideo/video_screen_enlarge_2x.png');
      span {
        display: none;
      }
    }
  }
  .dplayer-hide-controller .video-player-header {
    display: none;
  }

  .dplayer-playing {
    .dplayer-controller {
      .dplayer-play-icon {
        background-image: url('~@/assets/image/myVideo/video_pause_2x.png');
      }
    }
  }
}

.video-player-fullscreen {
  .dplayer {
    .dplayer-full-icon {
        background-image: url('~@/assets/image/myVideo/video_screen_shrink_2x.png');
    }
  }
}
</style>
