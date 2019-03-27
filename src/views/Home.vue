<template>
  <div class="home">
    <ul>
      <li>
        <a href="./#/demo/list">demo</a>
      </li>
      <li>
        <a href="./#/game">game</a>
      </li>
    </ul>
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
