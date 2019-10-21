<template>
  <component v-if="compState !== 0" :is="compState === 1 ? compName : 'home-error'"></component>
</template>

<script>
import Vue from "vue";
import HomeError from "./home-error";

const getDemoComponent = function (name) {
    return import(/* webpackChunkName: "[request]" */"@/components/" + name);
}

export default {
  name: "demo",
  props: {
    compName: {
      type: String,
      default: "list"
    }
  },
  components: {
    HomeError
  },
  data() {
    return {
      compState: 0
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
      this.compState = 0;

      getDemoComponent(this.compName)
        .then(o => {
          Vue.component(this.compName, o.default);
          this.compState = 1;
        })
        .catch(err => {
          this.$message.error({ message: err });
          this.compState = -1;
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
