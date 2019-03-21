<template>
  <div class="home">
    <a href="./#/demo/list">demo</a>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  mounted() {
    window.home = this;
  }
};
</script>

<style scoped>
.home {
  height: 100%;
  overflow: hidden;
}
</style>
