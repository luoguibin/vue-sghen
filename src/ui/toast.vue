<template>
  <transition :name="'toast-' + direction">
    <div v-show="visible" :class="'sg-toast sg-toast-' + direction">
      <div v-if="loading" class="loading-wraper">
        <div class="sg-loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div>{{msg}}</div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',

  data () {
    return {
      direction: 'bottom',
      msg: '',
      visible: false,
      loading: false
    }
  },

  created () {
    window.toast = this
  },

  methods: {
    show (msg, params = {}) {
      if (this.visible && !params.replace) {
        return
      }
      this.hide()
      this.msg = msg
      this.direction = params.direction || 'top'
      this.duration = params.duration || 3000
      this.loading = params.loading
      this.visible = true

      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.hide()
          this.timer = null
        }, this.duration || 3000)
      }
    },
    hide () {
      this.visible = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  },

  beforeDestroy () {
    this.hide()
  }
}
</script>

<style lang="scss" scoped>

.sg-toast {
  position: fixed;
  left: 50%;
  min-width: 8rem;
  max-width: 80%;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 1.2rem;
  line-height: 1.8rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 0.6rem;
  transform: translateX(-50%);
  z-index: 999;

  .loading-wraper {
    text-align: center;
    padding: 1rem;
  }
}
.sg-toast-top {
  top: 2rem;
}
.sg-toast-bottom {
  bottom: 2rem;
}
.sg-toast-middle {
  top: 50%;
  transform: translate(-50%, -50%);
}

.sg-loading {
  display: inline-block;
  position: relative;
  width: 5rem;
  height: 5rem;
  box-sizing: border-box;
  animation: loading 5s infinite linear;
  span {
    position: absolute;
    display: block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #148acf;
    animation: loading-span 1s infinite linear;

    &:nth-child(1) {
      top: 0.25rem;
      left: 0.25rem;
    }
    &:nth-child(2) {
      top: 0.25rem;
      left: 2.75rem;
      background: #15b151;
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      top: 2.75rem;
      left: 0.25rem;
      background: #f1440f;
      animation-delay: 0.4s;
    }
    &:nth-child(4) {
      top: 2.75rem;
      left: 2.75rem;
      background: #9b59b6;
      animation-delay: 0.6s;
    }
  }
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-span {
  0% {
    transform: scale(1);
    border-radius: 50%;
  }
  50% {
    transform: scale(0.5);
    border-radius: 0%;
  }
  100% {
    transform: scale(1);
    border-radius: 50%;
  }
}

.toast-top-enter-active,
.toast-top-leave-active,
.toast-middle-enter-active,
.toast-middle-leave-active,
.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition: all 0.3s ease;
}
.toast-top-enter,
.toast-top-leave-to {
  top: -2rem;
  opacity: 0;
}
.toast-bottom-enter,
.toast-bottom-leave-to {
  bottom: -2rem;
  opacity: 0;
}
.toast-middle-enter,
.toast-middle-leave-to {
  opacity: 0;
}
</style>
