<template>
  <div class="home">
    <home-bg></home-bg>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {
    "home-bg": () => import("@/components/home/HomeBg")
  },
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
