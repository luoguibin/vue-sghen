<template>
  <div>
    <p>子组件中直接更改对象中的属性，在父组件中深度watch，也可进行通信</p>
    <div>hello1:{{info.a || ''}}</div>
  </div>
</template>

<script>
export default {
  name: "hello1",

  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  data() {
    return {
      testData: 123
    };
  },

  beforeCreate() {
    console.log(this.testFunc, this.testData);
  },

  created() {
    window.hello1 = this;
    this.testAsync2();
  },

  methods: {
    testFunc() {},

    async testAsync() {
      return "success";
    },

    async testAsync2() {
      const a = await this.testAsync();
      console.log(a);
    }
  }
};
</script>

<style>
.hello1 {
}
</style>
