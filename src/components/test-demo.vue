<template>
  <div class="test-demo"
    @touchstart="onTouch('touchstart', $event)"
    @touchmove="onTouch('touchmove', $event)"
    @touchend="onTouch('touchend', $event)"
  >
    <div class="test-input">
      <input placeholder="封号" />
      <label>封号</label>
    </div>
    <div class="td-tabs" ref="tdTabs" @click="onTabClick">
      <div class="td-tab-indicator" :style="indicatorStyle"></div>
      <div class="td-tab">tab1</div>
      <div class="td-tab">tab2</div>
      <div class="td-tab">tasadfsadfasb1</div>
      <div class="td-tab">tafsadfsafsadfsfdgssdfgdfb2</div>
    </div>

    <button @click="onShowToast(1)">show toast1</button>
    <button @click="onShowToast(2)">show toast2</button>

    <input type="file" @change="onFileChange" multiple />

    <div :class="{ 'toast': true, 'toast-anim-0': true, 'toast-visible': toastVisbile1 }">
      I'm a toast
    </div>
    
    <transition name="toast">
      <div class="toast" v-show="toastVisbile2">I'm a toast, too.</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TestDemo',

  data() {
    return {
      toastVisbile1: false,
      toastVisbile2: false,

      indicatorStyle: {
        top: '0px',
        left: '0px',
        width: '0px'
      }
    }
  },

  created() {
    window.testDemo = this
  },

  mounted() {
    this.tabIndex = 1
    this.onSelectTab(this.tabIndex)
    window.addEventListener('resize', e => {
      this.onSelectTab(this.tabIndex)
    })
  },

  methods: {
    onTouch(key, e) {
      switch (key) {
        case 'touchstart':
          this.touchKey = key

          if (this.pressTimer) {
            clearTimeout(this.pressTimer)
          }
          this.pressTimer = setTimeout(() => {
            this.pressTimer = null
            console.log('长按触发', e.target)
            if (e.target.tagName === 'BUTTON') {
              if (e.target.previousElementSibling) {
                console.log('第2个按钮')
              } else {
                console.log('第1个按钮')
              }
            }
          }, 1500);
          break
        case 'touchmove':
          this.touchKey = key
          if (this.pressTimer) {
            clearTimeout(this.pressTimer)
            this.pressTimer = null
          }
          break
        case 'touchend':
          if (this.pressTimer) {
            clearTimeout(this.pressTimer)
            this.pressTimer = null
          }
          break
        default:
          break
      }
    },
    onShowToast(index = 1) {
      this['toastVisbile' + index] = true
      if (this['toastTimer' + index]) {
        clearTimeout(this['toastTimer' + index])
      }
      this['toastTimer' + index] = setTimeout(() => {
        this['toastVisbile' + index] = false
        this['toastTimer' + index] = null
      }, 3000)
    },
    onFileChange(e) {
    },
    onTabClick(e) {
      const target = e.target
      if (target === this.$refs.tdTabs) {
        return
      }

      let index = 0
      let tempEl = target
      while (tempEl.previousElementSibling) {
        index++
        tempEl = tempEl.previousElementSibling
      }

      this.onSelectTab(index)
    },
    onSelectTab(index) {
      console.log('onSelectTab', index)
      if (index === 0) {
        return
      }
      this.tabIndex = index
      
      const target = this.$refs.tdTabs.children[index]
      const elRect = target.getBoundingClientRect()
      const paRect = target.parentElement.getBoundingClientRect()

      const style = this.indicatorStyle
      style.left = elRect.left - paRect.left + 'px'
      style.top = elRect.top - paRect.top + elRect.height + 'px'
      style.width = elRect.width + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.test-demo {
  height: 100%;

  .test-input {
    position: relative;
    box-sizing: border-box;
    border-bottom: 5px solid rgb(190, 190, 190);
    input {
      width: 100%;
      display: block;
      padding: 0 12px;
      line-height: 35px;
      box-sizing: border-box;
      border: none;
      background-color: transparent;
      outline: none;
      &:placeholder-shown::placeholder {
          color: transparent;
      }
      &:focus~label,
      &:not(:placeholder-shown)~label {
        color: steelblue;
        transform: translate(0, -16px);
      }
    }
    label {
      position: absolute;
      left: 10px;
      top: 5px;
      transition: transform 300ms;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -5px;
      transform: scale(0);
      transition: transform 300ms;
      border-bottom: 5px solid steelblue;
    }
    &:focus-within::after {
      transform: scale(1);
    }
  }

  .td-tabs {
    text-align: center;
    position: relative;
    padding: 10px 20px 30px;
    .td-tab-indicator {
      display: inline-block;
      height: 3px;
      position: absolute;
      top: 0;
      background-color: royalblue;
      transition: all 0.3s;
    }
    .td-tab {
      display: inline-block;
      padding: 5px 10px;
      background-color: rgba(65, 105, 225, 0.2);
      cursor: pointer;
    }
    .td-tab + .td-tab {
      margin-left: 10px;
      margin-bottom: 20px;
    }
  }

  .toast {
    position: fixed;
    bottom: 0px;
    left: 50%;
    width: 200px;
    padding: 10px 20px;
    color: white;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    transform: translateX(-50%);
  }
  .toast-anim-0 {
    bottom: -60px;
    transition: bottom 300ms;
  }
  .toast-visible {
    bottom: 0px;
  }

  /* 设置持续时间和动画函数 */
  .toast-enter-active {
    transition: all .3s ease;
  }
  .toast-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .toast-enter, .toast-leave-to {
    bottom: -60px;
    opacity: 0;
  }
}
</style>