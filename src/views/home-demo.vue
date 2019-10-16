<template>
  <component v-if="isCompReady" :is="compName"></component>
</template>

<script>
import Vue from "vue";
import { getDemoComponent } from "../components/index";

export default {
  name: "demo",
  props: {
    compName: {
      type: String,
      default: "list"
    }
  },
  data() {
    return {
      isCompReady: false
    };
  },

  mounted() {
    console.log("Demo::mounted()");
    window.demo = this;
    this.initComp();
  },

  watch: {
    compName() {
      this.initComp();
    }
  },

  methods: {
    initComp() {
      this.$NProgress.start();
      this.isCompReady = false;

      getDemoComponent(this.compName)
        .then(o => {
          Vue.component(this.compName, o.default);
          this.isCompReady = true;
        })
        .catch(err => {
          this.$message.error({ message: err });
        })
        .finally(() => {
          this.$NProgress.done();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
