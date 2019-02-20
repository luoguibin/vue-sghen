<template>
  <div id="g-hello">
    <div :class="$style['g-hello']">
      g-hello,<slot>world</slot>
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
    console.log(this.$style);

    window.gHello = this;
    let obj = {};
    this.$once("hook:beforeDestroy", () => {
      obj = null;
    });

  },
  methods: {
  }
};
</script>

<style scoped>
#g-hello {
  background-color: white;
  overflow: hidden;
}
</style>


<style module>
.g-hello {
  font-size: 25px;
  font-weight: bold;
}
</style>
