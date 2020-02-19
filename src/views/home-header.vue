<template>
  <div class="home-header">
    <el-button type="text">None</el-button>
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
  }
};
</script>

<style lang="scss" scoped>
.home-header {
  height: 100%;
}
</style>

