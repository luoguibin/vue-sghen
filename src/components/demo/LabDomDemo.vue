<template>
  <div class="lab-dom-demo"></div>
</template>

<script>
import LabContainer from "../../common/demo/lab-dom-demo/LabContainer";
import anime from "animejs";

// 定义元素集合及初始状态
const labDomDatas = [
  {
    tag: "img",
    config: {
      action: 2
    },
    attribute: {
      src: require("@/assets/textures/grass.png")
    },
    style: {
      width: "200px",
      height: "120px",
      position: "absolute",
      left: "300px",
      top: "200px"
    }
  },
  {
    tag: "div",
    config: {
      action: 2
    },
    style: {
      position: "absolute",
      left: "500px",
      top: "200px",
      width: "190px",
      height: "190px",
      borderRadius: "100px",
      border: "5px solid gray",
      backgroundColor: "#333333",
      overflow: "hidden"
    },
    children: [
      {
        tag: "img",
        config: {
          action: 2
        },
        attribute: {
          src: require("@/assets/textures/grass.png")
        },
        style: {
          width: "50px",
          height: "50px",
          position: "absolute",
          left: "70px",
          top: "70px",
          transformOrigin: "25px -70px",
          transform: "rotate(80deg)"
        }
      }
    ]
  }
];

// 定义元素过程状态
const labDomSteps = [
  {
    id: 2020000,
    animeStyle: {
      left: "500px",
      top: "300px",
      opacity: 0
    },
    animeConfig: {
      duration: 1000,
      delay: 300
    },
    call: "after" // "immediate"
  },
  [
    {
      id: 2020002,
      animeStyle: {
        transform: "rotate(0deg)", // dom style
        rotate: 0 // anime style
      },
      animeConfig: {
        duration: 1000,
        delay: 300
      },
      call: "after"
    }
  ],
  {
    id: 2020000,
    animeStyle: {
      opacity: 1
    },
    animeConfig: {
      duration: 0,
      delay: 0
    },
    call: "immediate"
  }
];

export default {
  name: "LabDomDemo",
  mounted() {
    window.labDomDemo = this;

    this.labContainer = new LabContainer(this.$el);
    this.labContainer.setData(labDomDatas);

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
      console.log("nextStep() " + index);
      const step = labDomSteps[index],
        labContainer = this.labContainer;
      if (step instanceof Array) {
        step.forEach(step_ => {
          this.animeLabDom(labContainer, step_);
        });
      } else {
        this.animeLabDom(labContainer, step);
      }
    },
    animeLabDom(c, o) {
      console.log(o);
      const labDom = c.getLabDom(o.id);
      const o_ = {
        targets: labDom.el,
        easing: "linear",
        ...o.animeStyle,
        ...o.animeConfig,
        complete: () => {
          labDom.setStyle(o.animeStyle);
          if (o.call === "after") {
            this.nextStep();
          }
        }
      };
      anime(o_);
      if (o.call === "immediate") {
        this.nextStep();
      }
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
}

.lab-dom-demo * {
  user-select: none;
}
</style>
