<template>
  <div class="countup-demo" @click="start">
    <p>countup.js demo</p>
    <div v-for="(num, index) in nums" :key="index" ref="numEls" class="countup-item">0</div>

    <p>ICountUp vue component demo</p>
    <count-up
      v-for="(num, index) in nums"
      :key="'count-up-' + index"
      :endVal="num"
      :options="options"
      class="countup-item"
      @ready="onReady"
    ></count-up>
  </div>
</template>

<script>
import { CountUp } from "countup.js";
import ICountUp from "vue-countup-v2";

export default {
  name: "CountUpDemo",
  data() {
    return {
      nums: [],
      endVal: 120500,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: ""
      }
    };
  },
  components: {
    "count-up": ICountUp
  },
  created() {
    window.countupDemo = this;
    for (let i = 0; i < 5; i++) {
      this.nums.push(1000 + Math.round(Math.random() * 10000));
    }
  },
  mounted() {
    console.log("countup-demo::mounted()");
    this.start();
  },
  methods: {
    start() {
      const numEls = this.$refs.numEls,
        nums = this.nums;
      numEls.forEach((numEl, i) => {
        new CountUp(numEl, nums[i], { duration: 6 }).start();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.countup-demo {
  text-align: center;

  .countup-item {
    display: inline-block;
    width: 100px;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: #eee;
    margin: 5px;
    font-size: 28px;
    color: #148acf;
  }
}
</style>
