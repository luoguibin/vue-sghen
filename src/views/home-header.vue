<template>
  <div class="home-header">
    <el-button type="text" @click="onGoIndex(2)">Vue Render</el-button>
    <el-button type="text" @click="onGoIndex(3)">Vue-JS-CSS</el-button>
  </div>
</template>

<script>
export default {
  name: "home-header",

  data() {
    return {};
  },

  created() {
    window.homeHeader = this;
  },

  methods: {
    onGoIndex(num) {
      location.href = location.origin + `/index${num}.html`;
    }
  }
};
</script>

<style lang="scss" scoped>
.home-header {
  height: 100%;
}
</style>

