<template>
  <div class="lab-dom-demo"></div>
</template>

<script>
import LabContainer from "../../common/demo/lab-dom-demo/lab-container";
import LabDom from "../../common/demo/lab-dom-demo/lab-dom";
import {
  waveConfig,
  labDomDatas0,
  labDomSteps0,
  labDomDatas1,
  labDomSteps1
} from "../../common/demo/lab-dom-demo/data-config";
import anime from "animejs";

export default {
  name: "LabDomDemo",
  data() {
    return {
      currentStep: null,
      currentStepIndex: -1
    };
  },
  mounted() {
    if (this.$route.query.lab === "seed1") {
      this.labDomDatas = labDomDatas1;
      this.labDomSteps = labDomSteps1;
    } else {
      this.labDomDatas = labDomDatas0;
      this.labDomSteps = labDomSteps0;
    }
    window.labDomDemo = this;

    // 初始化LabContainer
    const labContainer = new LabContainer(this.$el, this);
    this.labContainer = labContainer;

    // 初始化waveDom
    this.waveDom = new LabDom(labContainer, waveConfig);
    this.waveDom.el.classList.add("lab-dom-wave");
    labContainer.removeLabDom(this.waveDom);

    // 设置数据及事件回调
    labContainer.setData(this.labDomDatas);
    labContainer.setCall(
      dom => {
        const step = this.currentStep;

        // 一步骤停止波纹提示
        this.hideWaveDom();

        // 一步骤是否闪现提示拖动物体至所在的位置
        if (step.twinkle) {
          this.showTwinkle(dom.el, step.style_);
        }
      },
      (dom, addLeft, addTop) => {
        const step = this.labDomSteps[this.currentStepIndex];
        if (!step) return;

        // 跟随元素的位置改变
        if (step.follow) {
          const fDom = this.labContainer.getLabDom(step.follow.id);
          const { left, top } = fDom.getWidthLeft();

          fDom.setStyle({
            left: left + addLeft + "px",
            top: top + addTop + "px"
          });
        }
      },
      (dom, isMove) => {
        const step = this.labDomSteps[this.currentStepIndex];
        if (!step) return;

        //　一步骤是否可进入位置判断
        if (step.style_) {
          if (isMove) {
            const { left, top } = dom.getWidthLeft();
            const left_ = parseInt(step.style_.left),
              top_ = parseInt(step.style_.top);

            // 拖动位置是否正确
            if (this.getDistance(left, top, left_, top_) < (step.limit || 30)) {
              this.setLabdDomCAS(dom, step, "_");
              this.checkFollow(step.follow, "_");
              this.nextStep();
            }
          } else {
            this.setLabdDomCAS(dom, step, "_");
            this.nextStep();
          }
        }

        this.hideTwinkleEl();
      }
    );

    this.nextStep();
  },
  methods: {
    /**
     * 进行下一步骤
     */
    nextStep() {
      if (++this.currentStepIndex >= this.labDomSteps.length) {
        console.log("nextStep() end");
        return;
      }

      this._processStep();
    },

    /**
     * 处理当前步骤
     */
    _processStep() {
      const step = this.labDomSteps[this.currentStepIndex];
      this.currentStep = step;
      console.log("processStep() " + this.currentStepIndex);

      const dom = this.labContainer.getLabDom(step.id);

      // 一步骤是否波纹提示操作组件
      if (step.wave) {
        this.showWaveDom(dom);
      }

      // 一步骤是否立刻设置配置参数、节点属性、样式（自动判断是否为空）
      this.setLabdDomCAS(dom, step);
      this.checkFollow(step.follow);

      // 一步骤是否进行动画(如果多个动画执行，然后立刻销毁则存在bug)
      if (step.anime) {
        const o = {
          targets: dom.el,
          easing: "linear",
          ...step.anime,
          complete: () => {
            dom.setStyle(step.style_);
            this.checkCall(step.call, "after");
          }
        };
        anime(o);
      }

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

      if (call === "before") {
        this.nextStep();
      } else if (call === "after") {
        this.nextStep();
      } else if (call.indexOf("::")) {
        console.log("checkCall() " + call + " " + match);
        const funStr = call.split("::");
        this[funStr[1]] && this[funStr[1]]();
      }
    },

    /**
     * 检测跟随的步骤
     * @param {Object} step
     * @param {String} suffix
     */
    checkFollow(step, suffix) {
      if (!step) return;
      const dom = this.labContainer.getLabDom(step.id);
      this.setLabdDomCAS(dom, step, suffix);
    },

    /**
     * 闪烁提示显示
     * @param {HTMLElement} el
     * @param {Object} style
     */
    showTwinkle(el, style) {
      let twinkleEl = this.twinkleEl;
      if (!twinkleEl || el.getAttribute("id") != twinkleEl.getAttribute("id")) {
        twinkleEl = el.cloneNode(true);
        twinkleEl.classList.add("lab-dom-twinkle");
        twinkleEl.style.zIndex = 99;
        twinkleEl.style.left = style.left;
        twinkleEl.style.top = style.top;
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
      const { width, height, top, left } = dom.getWidthLeft();
      const { width: width_, height: height_ } = waveDom.getWidthLeft();

      // 居中显示
      waveDom.setStyle({
        top: top + height / 2 - width_ / 2 + "px",
        left: left + width / 2 - height_ / 2 + "px"
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
      this.currentStepIndex = -1;
      this.hideWaveDom();
      this.hideTwinkleEl();
      if (next) this.nextStep();
    },

    /**
     * 跳步骤
     * @param {Number} index 步骤下标
     */
    jumpStep(index) {
      if (index < 0 || index >= this.labDomSteps.length) return;
      this.resetLabDoms(false);

      const labContainer = this.labContainer;
      for (let i = 0; i <= index; i++) {
        const step = this.labDomSteps[i],
          labDom = labContainer.getLabDom(step.id);

        this.setLabdDomCAS(labDom, step);
        this.setLabdDomCAS(labDom, step, "_");

        this.checkFollow(step.follow);
        this.checkFollow(step.follow, "_");
      }

      setTimeout(() => {
        this.currentStepIndex = index;
        this.nextStep();
      }, 1000);
    },

    setLabdDomCAS(dom, step, suffix) {
      if (!suffix) suffix = "";
      dom.setConfig(step["config" + suffix]);
      dom.setAttribute(step["attribute" + suffix]);
      dom.setStyle(step["style" + suffix]);
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
