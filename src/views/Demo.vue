<template>
    <div class="demo">
        <component v-if="compName" :is="compName"></component>
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
        LabDomDemo: true
      }
    };
  },
  mounted() {
    window.demo = this;
    this.init();
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
