<template>
  <el-container class="home-container">
    <el-aside class="home-container_left">
      <div
        class="left_item"
        v-for="(newRoute, index) in newRoutes"
        :key="index"
        @click="onClick(newRoute.path)"
      >{{newRoute.name}}</div>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "home-container",
  data() {
    return {
      newRoutes: []
    };
  },
  created() {
    window.homeContainer = this;
  },
  mounted() {
    this.newRoutes = [].concat(this.$router.newRoutes);
    console.log(this.newRoutes);
  },
  methods: {
    onClick(path) {
      console.log(path);
      this.$router.push({ path: "/home-container/" + path });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;

  #{&}_left {
    width: 80px !important;
    background-color: rgb(81, 115, 131);

    .left_item {
      margin-bottom: 10px;
      height: 30px;
      counter-reset: white;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
}
</style>
