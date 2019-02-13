<template>
  <div class="demo">
    <component v-if="compName" :is="compName"></component>
    <p v-else>{{Object.keys(componentMap).join("&nbsp;&nbsp;")}}</p>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "demo",
  data() {
    return {
      compName: "",
      componentMap: {
        LabDomDemo: true,
        LineAdsorption: true,
        ShapeCut: true
      }
    };
  },
  mounted() {
    window.demo = this;
    this.init();
  },
  watch: {
    $route(to, from) {
      if (to.path.indexOf("demo") >= 0) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      const compName = this.$route.query.compName;
      if (compName && this.componentMap[compName]) {
        import("@/components/demo/" + compName).then(o => {
          if (!Vue.component(compName)) {
            Vue.component(compName, o.default);
          }
          this.compName = compName;
        });
      } else {
        this.compName = "";
      }
    }
  }
};
</script>

<style scoped>
.demo {
  height: 100%;
}
</style>
