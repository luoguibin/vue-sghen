<template>
    <div></div>
</template>

<script>
export default {
  data() {
    return {
      txt: "g-hello"
    };
  },
  inject: {
    getApp2: "getApp"
  },
  // inject: ['getApp']
  mounted() {
    console.log(this.getApp2().$options.name);

    let obj = {};
    this.$once("hook:beforeDestroy", () => {
      obj = null;
    });
  }
};
</script>

<style>
</style>
