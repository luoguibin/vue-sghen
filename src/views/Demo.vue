<template>
  <div class="demo">
    <component v-if="compName" :is="compName"></component>
    <div v-else style="padding-top: 10px;">
      <router-link v-for="(val, key) in componentMap" :key="key" :to="'/demo/' + key" class="a-link">{{key}}</router-link>
    </div>
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
        ShapeCut: true,
        WorkerDemo: true
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
      const compName = this.$route.params.name;
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

.a-link {
  padding: 10px;
  margin: 5px;
}
</style>
