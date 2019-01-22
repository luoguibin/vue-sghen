<template>
    <div class="lab-dom-demo">

    </div>
</template>

<script>
import { LabContainer } from "../../common/demo/lab-dom-demo/LabContainer";

export default {
  name: "LabDomDemo",
  mounted() {
    window.labDomDemo = this;
    this.labContainer = new LabContainer(this.$el);
  }
};
</script>

<style scoped>
.lab-dom-demo {
  height: 100%;
}
</style>
