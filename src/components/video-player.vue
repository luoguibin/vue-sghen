<template>
  <div class="video-player">
    <div class="video-player-header">
      <img @click="goBack" src="@/assets/image/audio/audio_previous.png" alt />
      <p class="video-name">{{videoName}}</p>
    </div>

    <div ref="wrapper" :class="{'video-player-wrapper': true, 'video-hidden': !videoReady }">
      <video
        ref="video"
        :src="videoURL"
        playsinline="true"
        x-webkit-airplay="true"
        x5-playsinline="true"
        webkit-playsinline="true"
        x5-video-player-type="h5"
        @waiting="handleWaiting"
        @canplay="hanldeCanPlay"
        @play="hanlePlay"
        @playing="handlePlaying"
        @error="handleError"
      ></video>
      <div class="video-player-poster" v-show="posterVisible">
        <img class="poster" :src="videoPosterURL" />
        <img class="play" @click="onInitPlay" src="@/assets/image/audio/audio_play.png" />
      </div>
    </div>

    <div class="video-player-tip" v-show="tipVisible">
      <p>加载失败，请
        <span @click="onReload">重新加载</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',

  data () {
    return {
      videoReady: false,
      videoName: 'mov_bbb.mp4',
      videoURL: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
      videoPosterURL:
        'http://218.104.127.194:2414/storageWeb/servlet/GetFileByURLServlet?root=/mnt/D999&fileid=mz74bda2ec99358cab89c7625ff8c28e6c.mp4&ct=3&type=1&code=A16BCA895B99F451D0F77AFC92EC9339033717F750518E923756F3AC15356D28&account=MTU2MjUwNDU5ODQ=&p=0&ui=TT11jJpQI00x&ci=TT11jJpQI00x0042020040816524000h&cn=mov_bbb&oprChannel=10000000&dom=D888',
      tipVisible: false,
      posterVisible: true,
      hasUserAction: false
    }
  },

  mounted () {
    window.videoPlayer = this
    // this.$loading()
  },

  methods: {
    goBack () {
      if (history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/main')
      }
    },

    onInitPlay (e) {
      this.$refs.video.play()
      this.posterVisible = false
      this.hasUserAction = !!e
    },

    onReload () {
      this.tipVisible = false
      this.$refs.video.load()
    },

    handleWaiting (e) {
      console.log('handleWaiting', e)
    },
    hanldeCanPlay (e) {
      console.log('hanldeCanPlay', e)
      const video = this.$refs.video
      if (!this.videoReady) {
        video.setAttribute('controls', true)
        // this.$loading.hide()
        this.videoReady = true
      }
      if (video.paused && this.hasUserAction) {
        video.play()
      }
    },
    hanlePlay (e) {
      console.log('hanlePlay', e)
    },
    handlePlaying (e) {
      console.log('handlePlaying', e)
    },
    handleError (e) {
      const error = e.target.error
      console.log('handleError', error)
      this.tipVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  height: 100%;
  background-color: black;

  video {
    width: 100%;
  }

  .video-hidden {
    video {
      opacity: 0;
    }
  }

  .video-player-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 4.4rem;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 29999;
    box-sizing: border-box;
    background: linear-gradient(rgba(0, 0, 0, 0.5), transparent);
    padding: 0 1.6rem;
    img {
      display: inline-block;
      width: 2rem;
    }
    .video-name {
      flex: 1;
      color: #fff;
      font-size: 1.6rem;
      text-align: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      padding-right: 2rem;
    }
  }

  .video-player-wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
  }

  .video-player-poster {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
      color:rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
      span {
        color:rgba(49, 129, 249, 0.8);
      }
    }
  }
}
</style>
