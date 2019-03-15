<template>
    <div class="rotate-demo">
        {{hour.value}}:{{minute.value}}:{{second.value}}

        <div class="clock-bg"></div>
        <div class="hour" :style="hourStyle" ref="hour"></div>
        <div class="minute" :style="minuteStyle" ref="minute"></div>
        <div class="second" :style="secondStyle" ref="second"></div>
    </div>
</template>

<script>
import Draggable from "../../common/demo/rotate-demo/draggable";

export default {
  data() {
    return {
      hour: {
        value: 0,
        rotate: 0,
        rotate_: 0,
        preRotate: 0,
        oriRotate: 0
      },
      minute: {
        value: 0,
        rotate: 0,
        rotate_: 0,
        preRotate: 0,
        oriRotate: 0
      },
      second: {
        value: 0,
        rotate: 0,
        rotate_: 0,
        preRotate: 0,
        oriRotate: 0
      }
    };
  },
  created() {
    window.rotateDemo = this;
  },
  mounted() {
    this.hourDraggable = new Draggable(this.$refs.hour);
    this.hourDraggable.setCall(
      e => {
        const hour = this.hour;
        hour.oriRotate = hour.rotate;
        hour.preRotate = hour.rotate;
      },
      e => {
        const hour = this.hour;
        hour.rotate = hour.oriRotate + e.rad;
      }
    );
    this.minuteDraggable = new Draggable(this.$refs.minute);
    this.minuteDraggable.setCall(
      e => {
        const minute = this.minute;
        minute.oriRotate = minute.rotate;
        minute.preRotate = minute.rotate;
      },
      e => {
        const minute = this.minute;
        minute.rotate = minute.oriRotate + e.rad;
      }
    );
    this.secondDraggable = new Draggable(this.$refs.second);
    this.secondDraggable.setCall(
      e => {
        const second = this.second;
        second.oriRotate = second.rotate;
        second.preRotate = second.rotate;
      },
      e => {
        const second = this.second;
        second.rotate = second.oriRotate + e.rad;
      }
    );
  },
  computed: {
    hourStyle() {
      // 根据时钟12刻度，规范弧度范围[0, Math.PI*2)
      const hour = this.hour;
      let rotate_ = hour.rotate + Math.PI / 2,
        preRotate_ = hour.preRotate + Math.PI / 2;
      if (rotate_ < 0) rotate_ += Math.PI * 2;
      if (preRotate_ < 0) preRotate_ += Math.PI * 2;

      //   const value = rotate_ - preRotate_;
      //   if (value > Math.PI) {
      //     this.addHour(-1);
      //   } else if (value < -Math.PI) {
      //     this.addHour(1);
      //   }

      hour.preRotate = hour.rotate;
      hour.rotate_ = rotate_;
      this.updateClockValue();

      return {
        transform: `rotate(${hour.rotate}rad)`
      };
    },
    minuteStyle() {
      // 根据时钟12刻度，规范弧度范围[0, Math.PI*2)
      const minute = this.minute;
      let rotate_ = minute.rotate + Math.PI / 2,
        preRotate_ = minute.preRotate + Math.PI / 2;
      if (rotate_ < 0) rotate_ += Math.PI * 2;
      if (preRotate_ < 0) preRotate_ += Math.PI * 2;

      const value = rotate_ - preRotate_;
      if (value > Math.PI) {
        this.addHour(-1);
      } else if (value < -Math.PI) {
        this.addHour(1);
      }

      minute.preRotate = minute.rotate;
      minute.rotate_ = rotate_;
      this.updateClockValue();

      return {
        transform: `rotate(${minute.rotate}rad)`
      };
    },
    secondStyle() {
      // 根据时钟12刻度，规范弧度范围[0, Math.PI*2)
      const second = this.second;
      let rotate_ = second.rotate + Math.PI / 2,
        preRotate_ = second.preRotate + Math.PI / 2;
      if (rotate_ < 0) rotate_ += Math.PI * 2;
      if (preRotate_ < 0) preRotate_ += Math.PI * 2;

      const value = rotate_ - preRotate_;
      if (value > Math.PI) {
        this.addMinute(-1);
      } else if (value < -Math.PI) {
        this.addMinute(1);
      }

      second.preRotate = second.rotate;
      second.rotate_ = rotate_;
      this.updateClockValue();

      return {
        transform: `rotate(${second.rotate}rad)`
      };
    }
  },
  methods: {
    updateClockValue() {
      this.hour.value = Math.floor(this.hour.rotate_ / Math.PI / 2 * 12);
      this.minute.value = Math.floor(this.minute.rotate_ / Math.PI / 2 * 60);
      this.second.value = Math.floor(this.second.rotate_ / Math.PI / 2 * 60);
    },

    addHour(v) {
        this.hour.rotate = this.hour.rotate + v * Math.PI / 6;
    },
    addMinute(v) {
        this.minute.rotate = this.minute.rotate + v * Math.PI / 30;
    },
    addSecond(v) {

    }
  }
};
</script>

<style scoped>
.rotate-demo {
  height: 100%;
  position: relative;
}

.clock-bg {
  width: 680px;
  height: 680px;
  position: absolute;
  top: 72px;
  left: 185px;
  border: 3px solid gray;
  border-radius: 50%;
}

.hour {
  width: 250px;
  height: 30px;
  position: absolute;
  top: 400px;
  left: 500px;
  background-color: #111;
  border-left: 5px solid brown;
  transform-origin: 30px 50%;
  box-sizing: border-box;
}

.minute {
  width: 320px;
  height: 28px;
  position: absolute;
  top: 401px;
  left: 500px;
  background-color: #222;
  border-left: 5px solid brown;
  transform-origin: 30px 50%;
  box-sizing: border-box;
}

.second {
  width: 350px;
  height: 12px;
  position: absolute;
  top: 409px;
  left: 500px;
  background-color: #148acf;
  border-left: 5px solid brown;
  transform-origin: 30px 50%;
  box-sizing: border-box;
}
</style>
