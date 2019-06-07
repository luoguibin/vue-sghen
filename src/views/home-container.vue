<template>
    <div class="home-container">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: "home-container",
  created() {
    window.homeContainer = this;
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
</style>
