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
      action: 3
    },
    attributes: {
      src: require("@/assets/textures/grass.png")
    },
    style: {
      width: 200,
      height: 120,
      position: "absolute",
      left: 300,
      top: 200
    }
  },
  {
    tag: "div",
    config: {
      action: 3
    },
    style: {
      position: "absolute",
      left: 500,
      top: 200,
      width: 190,
      height: 190,
      borderRadius: 100,
      border: "5px solid gray",
      backgroundColor: "#333333",
      overflow: "hidden"
    },
    children: [
      {
        tag: "img",
        config: {
          action: 1
        },
        attributes: {
          src: require("@/assets/textures/grass.png")
        },
        style: {
          width: 50,
          height: 50,
          position: "absolute",
          left: 95 - 25,
          top: 95 - 25,
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
    anime: {
      left: 500,
      top: 300,
      opacity: 0,
      duration: 1000,
      delay: 300
    },
    call: "after" // "immediate"
  },
  [
    {
      id: 2020002,
      anime: {
        transform: "rotate(0deg)", // dom style
        rotate: 0, // anime style
        duration: 1000,
        delay: 300
      },
      call: "after"
    }
  ],
  {
    id: 2020000,
    anime: {
      opacity: 1,
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
      const styles = labDom.getStyles(),
        o_ = {
          targets: labDom.el,
          easing: "linear",
          ...o.anime,
          complete: () => {
            labDom.setStyle(o.anime);
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
