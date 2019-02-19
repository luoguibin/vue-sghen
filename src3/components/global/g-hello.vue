<template>
    <div>g-hello

      <div style="width: 200px; height: 100px; border: 1px solid gray; position: relative;">
        <button style="position: absolute; top: 0; right: -10px;">test</button>
      </div>
    </div>
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
    console.log(this.$attrs, this.$listeners);
    let obj = {};
    this.$once("hook:beforeDestroy", () => {
      obj = null;
    });
  }
};
</script>

<style>
</style>
