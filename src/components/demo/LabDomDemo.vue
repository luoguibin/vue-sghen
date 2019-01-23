<template>
  <div class="lab-dom-demo"></div>
</template>

<script>
import { LabContainer } from "../../common/demo/lab-dom-demo/LabContainer";
import { LabDom } from "../../common/demo/lab-dom-demo/LabDom";
import anime from "animejs";

export default {
  name: "LabDomDemo",
  mounted() {
    window.labDomDemo = this;
    this.labContainer = new LabContainer(this.$el);

    this.test();
  },
  methods: {
    test() {
      for (let i = 0; i < 2; i++) {
        const labDom = new LabDom(this.labContainer, "img", { action: 3 });
        labDom.setStyle({
          width: 200,
          height: 120,
          position: "absolute",
          left: 300,
          top: 200
        });
        labDom.setAttributes({ src: require("@/assets/textures/grass.png") });
        this.labContainer.appendLabDom(labDom);
      }

      const labDom = new LabDom(this.labContainer, "div", { action: 3 });
      labDom.setStyle({
        position: "absolute",
        left: 500,
        top: 200,
        padding: 30,
        border: "1px solid gray",
        transform: "rotate(-30deg)"
      });
      this.labContainer.appendLabDom(labDom);

      const labDom0 = new LabDom(this.labContainer, "span");
      labDom0.setInnerHTML("message-123");
      labDom.addChild(labDom0);

      const labDom1 = new LabDom(this.labContainer, "img", { action: 3 });
      labDom1.setStyle({ position: "absolute", transform: "rotate(30deg)" });
      labDom1.setAttributes({ src: require("@/assets/textures/grass.png") });
      labDom.addChild(labDom1);

      const styles = labDom.getStyles();
      anime({
        targets: labDom.el,
        left: [styles.left, styles.left + 300],
        top: [styles.top, styles.top + 300],
        easing: "linear",
        direction: "alternate",
        duration: 1000,
        delay: 1000,
        loop: 3
      });
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
