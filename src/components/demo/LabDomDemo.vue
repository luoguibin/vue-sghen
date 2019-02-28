<template>
  <div class="lab-dom-demo"></div>
</template>

<script>
import LabContainer from "../../common/demo/lab-dom-demo/LabContainer";
import LabDom from "../../common/demo/lab-dom-demo/LabDom";
import {
  waveConfig,
  labDomDatas,
  labDomSteps
} from "../../common/demo/lab-dom-demo/data-config";
import anime from "animejs";

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
        this.hideWaveDom();

        // 一步骤是否闪现提示拖动物体至所在的位置
        if (step.twinkle) {
          this.showTwinkle(dom.el, step.toLocation);
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
            dom.setStyle(step.toLocation);
            if (step.toConfig) {
              dom.setConfig(step.toConfig);
            }
            this.nextStep();
          }
        }

        this.hideTwinkleEl();
      }
    );

    this.stepIndex = -1;
    this.nextStep();
  },
  methods: {
    /**
     * 进行下一步骤
     */
    nextStep() {
      const stepIndex = ++this.stepIndex;
      if (stepIndex >= labDomSteps.length) {
        console.log("nextStep() end");
        return;
      }

      const step = labDomSteps[stepIndex];
      console.log("nextStep() " + stepIndex);
      this.processStep(step);
    },

    /**
     * 处理当前步骤
     * @param {Object} step 步骤对象
     */
    processStep(step) {
      const dom = this.labContainer.getLabDom(step.id);

      // 一步骤是否波纹提示操作组件
      if (step.wave) {
        this.showWaveDom(dom);
      }

      // 一步骤是否立刻设置样式
      if (step.style) {
        dom.setStyle(step.style);
      }

      // 一步骤是否进行动画(如果多个动画执行，然后立刻销毁则存在bug)
      if (step.animeConfig) {
        const o = {
          targets: dom.el,
          easing: "linear",
          ...step.animeConfig,
          complete: () => {
            dom.setStyle(step.animeEndStyle);
            this.checkCall(step.call, "after");
          }
        };
        anime(o);
      }

      // 是否立刻结束当前步骤
      this.checkCall(step.call, "before");
    },

    /**
     * 检测回调参数
     * @param {String} call
     * @param {String} match
     */
    checkCall(call, match) {
      if (!call) return;
      if (match && call.indexOf(match) === -1) return;
      console.log("checkCall() " + call + " " + match);

      if (call === "before") {
        this.nextStep();
      } else if (call === "after") {
        this.nextStep();
      } else if (call.indexOf("::")) {
        const funStr = call.split("::");
        this[funStr[1]] && this[funStr[1]]();
      }
    },

    /**
     * 闪烁提示显示
     * @param {HTMLElement} el
     * @param {Object} toLocation
     */
    showTwinkle(el, toLocation) {
      let twinkleEl = this.twinkleEl;
      if (!twinkleEl || el.getAttribute("id") != twinkleEl.getAttribute("id")) {
        twinkleEl = el.cloneNode(true);
        twinkleEl.classList.add("lab-dom-twinkle");
        twinkleEl.style.zIndex = 99;
        twinkleEl.style.left = toLocation.left;
        twinkleEl.style.top = toLocation.top;
        this.twinkleEl = twinkleEl;
      }

      el.parentElement.appendChild(twinkleEl);
    },

    /**
     * 闪烁提示隐藏
     */
    hideTwinkleEl() {
      const twinkleEl = this.twinkleEl;
      if (twinkleEl && twinkleEl.parentElement) twinkleEl.remove();
    },

    /**
     * 波纹提示显示
     * @param {LabDom} dom
     */
    showWaveDom(dom) {
      const waveDom = this.waveDom;
      const width = parseInt(dom.getStyle("width")),
        height = parseInt(dom.getStyle("height")),
        top = parseInt(dom.getStyle("top")),
        left = parseInt(dom.getStyle("left"));

      // 居中显示
      waveDom.setStyle({
        top: top + height / 2 - parseInt(waveDom.getStyle("height")) / 2 + "px",
        left: left + width / 2 - parseInt(waveDom.getStyle("width")) / 2 + "px"
      });
      dom.el.parentElement.appendChild(waveDom.el);
    },
    /**
     * 波纹提示隐藏
     */
    hideWaveDom() {
      const el = this.waveDom.el;
      if (el.parentElement) el.remove();
    },

    /**
     * 重置所有LabDom
     * @param {Boolean} next 是否进入下一步骤
     */
    resetLabDoms(next) {
      this.labContainer.resetLabDoms();
      this.stepIndex = -1;
      this.hideWaveDom();
      this.hideTwinkleEl();
      if (next) this.nextStep();
    },

    /**
     * 跳步骤
     * @param {Number} index 步骤下标
     */
    jumpStep(index) {
      if (index < 0 || index >= labDomSteps.length) return;
      this.resetLabDoms(false);

      const labContainer = this.labContainer;
      for (let i = 0; i <= index; i++) {
        const step = labDomSteps[i],
          labDom = labContainer.getLabDom(step.id);

        if (step.style) {
          labDom.setStyle(step.style);
        }
        if (step.toLocation) {
          labDom.setStyle(step.toLocation);
          if (step.toConfig) {
            labDom.setConfig(step.toConfig);
          }
        }
        if (step.animeEndStyle) {
          labDom.setStyle(step.animeEndStyle);
        }
      }

      setTimeout(() => {
        this.stepIndex = index;
        this.nextStep();
      }, 1000);
    },

    showTip() {
      console.log("showTip() is called");
      this.nextStep();
    },
    getDistance(x0, y0, x1, y1) {
      return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    }
  },
  beforeDestroy() {
    this.hideWaveDom();
    this.waveDom.release();
    this.waveDom = null;

    this.hideTwinkleEl();
    this.twinkleEl = null;

    this.labContainer.release();
  }
};
</script>

<style>
.lab-dom-demo {
  height: 100%;
  background-color: #333333;
  position: relative;
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
