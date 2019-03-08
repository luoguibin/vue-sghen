<template>
  <div class="app">
    <Tabs value="g-vue" class="tabs">

      <TabPane label="Vue" name="g-vue">
        <g-vue d-data="123" :d-data1="321" v-bind="val2"></g-vue>
        <g-render>day day up</g-render>
        <global-mixins></global-mixins>
      </TabPane>

      <TabPane label="JavaScript" name="g-js">
        <g-js></g-js>
      </TabPane>

      <TabPane label="Css" name="g-css">
        <g-css></g-css>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "App",
  data() {
    return {
      val0: 123,
      val1: 234,
      val2: {
        val3: 345
      }
    };
  },
  watch: {
    val0(v0, v1) {
      console.log(v0, v1);
    },
    val1: "printVal",
    "val2.val3": "printVal"
  },
  mounted() {
    window.vApp = this;
    this.$root
      .getDynamicComponent("dyna0")
      .then(o => {
        Vue.component("dyna0", o.default);
      })
      .catch(e => {
        // console.log("dyna0 load error")
      });
  },
  provide() {
    return {
      getApp: () => {
        return this;
      }
    };
  },
  methods: {
    printVal(v0, v1) {
      console.log("printVal", v0, v1);
    }
  }
};
</script>

<style lang="css" scoped>
.app {
  height: 100%;
  padding: 10px;
}
</style>

<style>
html,
body {
  height: 100%;
  overflow: hidden;
}

.ivu-tabs,
.ivu-tabs-content {
  height: 100%;
}
.ivu-tabs-tabpane {
  height: calc(100% - 52px);
  overflow-y: auto;
}
</style>
