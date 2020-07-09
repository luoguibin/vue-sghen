<template>
  <div class="demo">
    <component v-if="compState !== 0" :is="compState === 1 ? compName : 'error'" :data="compData"></component>
  </div>
</template>

<script>
import Vue from "vue";
import ErrorEl from "./error";

const getDemoComponent = function(name) {
  return import(/* webpackChunkName: "[request]" */ "@/components/" + name);
};

export default {
  name: "Demo",

  components: {
    error: ErrorEl
  },

  data() {
    return {
      compState: 0,
      compName: "",
      compData: null
    };
  },

  mounted() {
    window.demo = this;
  },

  watch: {
    $route: {
      immediate: true,
      handler() {
        this.initComp();
      }
    }
  },

  methods: {
    initComp() {
      this.$toast("加载中...", { loading: true, duration: -1, direction: 'middle' });
      const name = this.$route.params.name;
      this.compName = name;
      this.compState = 0;
      this.compData = null;

      getDemoComponent(name)
        .then(o => {
          Vue.component(name, o.default);
          this.compState = 1;
          this.$toast.hide();
        })
        .catch(err => {
          this.compState = -1;
          this.compData = err;
          this.$toast.hide();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.demo {
  height: 100%;
}
</style>
