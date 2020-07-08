<template>
  <div class="error">{{errorTip}}</div>
</template>

<script>
export default {
  name: "home-error",

  props: {
    data: {
      type: Object,
      default: null
    }
  },

  computed: {
    errorTip () {
      return this.data ? JSON.stringify(this.data) : '未知错误'
    }
  }
};
</script>

<style scoped>
.error {
  padding: 0 1.2rem;
  text-align: center;
  font-size: 1.2rem;
  line-height: 2.5rem;
  white-space: wrap;
  word-break: break-all;
}
</style>