<template>
    <div class="year2019" @click="onClickRain">
        <div class="year-mask" v-if="showRain" @click.stop="onClickMask()">
            <div class="year-content">{{showRain.rain.msg}}</div>
        </div>
        <div class="rain-container" ref="container"></div>
    </div>
</template>

<script>
import anime from "animejs";

export default {
  name: "Year2019",
  data() {
    return {
      rains: [],
      index: 2019000,
      showRain: null,
      canAnime: true
    };
  },
  mounted() {
    window.year2019 = this;
    this.testAdd();
  },
  methods: {
    testAdd() {
      for (let i = 33; i < 127; i++) {
        const s = String.fromCharCode(i);
        this.addRain("TEST  " + s + s + s + s + "  TESTTEST");
      }
    },

    onClickMask() {
      const animeObj = this.showRain.el.animeObj;
      if (animeObj) {
        if (animeObj.paused) animeObj.play();
      }
      this.showRain = null;
    },

    addRain(msg, repeat) {
      const index = this.index++,
        el = document.createElement("DIV");
      el.classList.add("year-rain");
      el.setAttribute("rain-id", index);
      el.innerHTML = msg;

      this.$refs.container.appendChild(el);
      const rain = {
        msg: msg,
        index: index,
        repeat: repeat || 1
      };
      el.rain = rain;
      this.rains.push(rain);
      this.randomRain(el);
    },

    removeRain(index) {
      if (typeof index === "number") {
        index += "";
      }
      const el = this.$refs.container,
        children = el.childNodes,
        len = children.length;

      for (let i = 0; i < len; i++) {
        const el_ = children[i];

        if (el_.getAttribute("rain-id") === index) {
          const animeObj = el_.animeObj;
          if (animeObj) {
            animeObj.pause();
            el_.animeObj = null;
          }
          el_.rain = null;
          el.removeChild(el_);

          const rains = this.rains,
            nIndex = parseInt(index);
          const index_ = rains.findIndex(o => {
            return o.index === nIndex;
          });
          rains.splice(index_, 1);
          break;
        }
      }
    },

    onClickRain(e) {
      const el = e.target,
        id = el.getAttribute("rain-id");
      if (id) {
        const obj = {
          el: el
        };
        const nIndex = parseInt(id);
        obj.rain = this.rains.find(o => {
          return o.index === nIndex;
        });
        if (obj.rain) {
          this.showRain = obj;
        }
        const animeObj = el.animeObj;
        if (animeObj) {
          if (!animeObj.paused) animeObj.pause();
          else animeObj.play();
        }
      }
    },
    randomRain(el) {
      const el_ = this.$el,
        width = el_.clientWidth,
        height = el_.clientHeight;

      el.animeObj = anime({
        targets: el,
        left: [Math.random() * width, Math.random() * (width * 2) - width / 3],
        top: [Math.random() * height / 2, Math.random() * height / 2 + height],
        scale: Math.random() * 2 + 0.7,
        easing: "linear",
        duration: Math.random() * 15000 + 15000,
        complete: () => {
          if (this.canAnime) {
              if (el.rain) {
                  if (el.rain.repeat === -1) {
                      this.randomRain(el);
                  } else if (el.rain.repeat > 1) {
                      el.rain.repeat--;
                      this.randomRain(el);
                  } else {
                      this.removeRain(el.rain.index);
                  }
              }
              
          }
        }
      });
    }
  },
  beforeDestroy() {
    this.canAnime = false;
  }
};
</script>

<style scoped>
.year2019 {
  height: 100%;
  position: relative;
}

.rain-container {
  height: 100%;
}

.year-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
}

.year-content {
  width: 88%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
}
</style>

<style>
.year-rain {
  position: absolute;
  left: 0;
  top: 0;
  transform: scale(1);
  border-radius: 10px;
  background-color: rgba(20, 122, 222, 0.3);
  padding: 10px;
}

.year-rain:hover {
  background-color: rgba(20, 122, 222, 0.6);
  color: red;
  cursor: pointer;
}
</style>
