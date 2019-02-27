<template>
  <div class="lab-dom-demo"></div>
</template>

<script>
import LabContainer from "../../common/demo/lab-dom-demo/LabContainer";
import LabDom from "../../common/demo/lab-dom-demo/LabDom";
import {
  waveConfig,
  labDomDatas
} from "../../common/demo/lab-dom-demo/data-config";

import anime from "animejs";

// 定义元素过程状态
const labDomSteps = [
  {
    id: "cap-set",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "530px",
      top: "250px"
    },
    toConfig: {
      action: 0
    }
  },
  {
    id: "cotton",
    animeConfig: {
      duration: 0,
      delay: 300
    },
    animeEndStyle: {
      display: "block"
    },
    call: "after" // "before" or "after::selfFunction" or "before::selfFunction"
  },
  {
    id: "cotton",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "15px",
      top: "-110px"
    },
    toConfig: {
      action: 0
    }
  },
  {
    id: "cotton",
    animeConfig: {
      scale: 0.6,
      duration: 1000,
      delay: 300
    },
    animeEndStyle: {
      transfrom: "scale(0.6)"
    },
    call: "after::showTip"
  },
  {
    id: "clip",
    style: {
      display: "block"
    },
    call: "before"
  },
  {
    id: "clip",
    wave: true,
    twinkle: true,
    toLocation: {
      left: "155px",
      top: "-110px"
    },
    toConfig: {
      action: 0
    }
  }
];

export default {
  name: "LabDomDemo",
  data() {
    return {};
  },
  mounted() {
    window.labDomDemo = this;

    // 初始化LabContainer
    const labContainer = new LabContainer(this.$el);
    this.labContainer = labContainer;

    // 初始化waveDom
    this.waveDom = new LabDom(labContainer, waveConfig);
    this.waveDom.el.classList.add("lab-dom-wave");
    labContainer.removeLabDom(this.waveDom);

    // 设置数据及事件回调
    labContainer.setData(labDomDatas);
    labContainer.setCall(
      dom => {
        const step = labDomSteps[this.stepIndex];
        if (!step) return;

        // 一步骤停止波纹提示
        if (step.wave) {
          this.waveDom.el.remove();
        }

        // 一步骤是否闪现提示拖动物体至所在的位置（可优化）
        if (step.twinkle && !this.twinkleEl) {
          const twinkleEl = dom.el.cloneNode(true);
          twinkleEl.classList.add("lab-dom-twinkle");
          twinkleEl.style.zIndex = 99;
          twinkleEl.style.left = step.toLocation.left;
          twinkleEl.style.top = step.toLocation.top;

          dom.el.parentElement.appendChild(twinkleEl);
          this.twinkleEl = twinkleEl;
        }
      },
      undefined,
      (dom, isMove) => {
        const step = labDomSteps[this.stepIndex];
        if (!step) return;

        //　一步骤是否可进入位置判断
        if (step.toLocation) {
          const left = parseInt(dom.getStyle("left")),
            top = parseInt(dom.getStyle("top"));
          const left0 = parseInt(step.toLocation.left),
            top0 = parseInt(step.toLocation.top);

          // 拖动位置是否正确
          if (this.getDistance(left, top, left0, top0) < 30) {
            if (step.toConfig) {
              dom.setStyle(step.toLocation);
              dom.setConfig(step.toConfig);
            }
            this.nextStep();
          }
        }

        //　闪烁提示隐藏
        if (this.twinkleEl) {
          this.twinkleEl.remove();
          this.twinkleEl = null;
        }
      }
    );

    this.stepIndex = -1;
    this.nextStep();
  },
  methods: {
    nextStep() {
      this.stepIndex++;
      const index = this.stepIndex;
      if (index >= labDomSteps.length) {
        console.log("nextStep() end");
        return;
      }

      const step = labDomSteps[index];
      console.log("nextStep() " + index);
      this.processStep(step);
    },
    processStep(step) {
      const dom = this.labContainer.getLabDom(step.id);

      // 一步骤是否波纹提示操作组件
      if (step.wave) {
        const width = parseInt(dom.getStyle("width")),
          height = parseInt(dom.getStyle("height")),
          top = parseInt(dom.getStyle("top")),
          left = parseInt(dom.getStyle("left"));
        this.waveDom.setStyle({
          top:
            top +
            height / 2 -
            parseInt(this.waveDom.getStyle("height")) / 2 +
            "px",
          left:
            left +
            width / 2 -
            parseInt(this.waveDom.getStyle("width")) / 2 +
            "px"
        });
        dom.el.parentElement.appendChild(this.waveDom.el);
      }

      // 一步骤是否立刻设置样式
      if (step.style) {
        dom.setStyle(step.style);
      }

      //　一步骤是否进行手动拖动至目标位置
      if (step.toLocation) {
        return;
      }

      // 一步骤是否进行动画
      if (step.animeConfig) {
        const o = {
          targets: dom.el,
          easing: "linear",
          ...step.animeConfig,
          complete: () => {
            dom.setStyle(step.animeEndStyle);
            if (step.call.indexOf("after") !== -1)
            this.checkCall(step.call);
          }
        };
        anime(o);
      }

      // 是否立刻结束当前步骤
      if (step.call.indexOf("before") !== -1)
        this.checkCall(step.call);
    },
    checkCall(call) {
      console.log("checkCall() " + call);
      if (call === "before") {
        this.nextStep();
      } else if (call === "after") {
        this.nextStep();
      } else if (call.indexOf("::")) {
        const funStr = call.split("::");
        this[funStr[1]] && this[funStr[1]]();
      }
    },
    showTip() {
      console.log("showTip() is called");
      this.nextStep();
    },
    getDistance(x0, y0, x1, y1) {
      return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    },

    resetLabDoms() {
      this.labContainer.resetLabDoms();
      this.stepIndex = -1;
      this.nextStep();
    },
    beforeDestroy() {
      this.labContainer.release();
    }
  }
};
</script>

<style>
.lab-dom-demo {
  height: 100%;
  background-color: #333333;
}

.lab-dom-demo * {
  user-select: none;
}

.lab-dom-twinkle {
  animation: twinkle-frames 0.6s alternate infinite linear;
}

@keyframes twinkle-frames {
  from {
    opacity: 0.3;
  }

  to {
    opacity: 0.7;
  }
}

.lab-dom-wave div {
  animation: wave-frames 3s infinite;
}
.lab-dom-wave div:nth-of-type(1) {
  animation-delay: 0s;
}
.lab-dom-wave div:nth-of-type(2) {
  animation-delay: 0.7s;
}
.lab-dom-wave div:nth-of-type(3) {
  animation-delay: 1.4s;
}

@keyframes wave-frames {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
