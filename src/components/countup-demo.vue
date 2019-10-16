<template>
  <div class="countup-demo">
    <p>countup.js demo</p>
    <div v-for="(num, index) in nums" :key="index" ref="numEls" class="countup-item">0</div>
    <el-divider></el-divider>
    <p>ICountUp vue component demo</p>
    <count-up
      v-for="(num, index) in nums"
      :key="'count-up-' + index"
      :endVal="num"
      :options="options"
      class="countup-item"
      @ready="onReady"
    ></count-up>

    <el-divider></el-divider>
    <p>el-badge demo</p>
    <el-badge
      v-for="(badge, index) in badges"
      :key="'count-up-badge-' + index"
      ref="badgeEls"
      style="margin: 20px;"
      :max="99"
      :value="badge.countUp ? badge.num : 0"
      :hidden="badge.num <= 0"
    >
      <el-button size="small">{{badge.title}}</el-button>
    </el-badge>
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
      badges: [
        { num: 0, title: "评论", countUp: false },
        { num: 25, title: "回复", countUp: false },
        { num: 82, title: "消息", countUp: false },
        { num: 123, title: "文件", countUp: false }
      ],

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
    const numEls = this.$refs.numEls,
      nums = this.nums;
    numEls.forEach((numEl, i) => {
      new CountUp(numEl, nums[i], { duration: 6 }).start();
    });

    const badgeEls = this.$refs.badgeEls,
      badges = this.badges;
    badgeEls.forEach((badgeEl, i) => {
      new CountUp(
        badgeEl.$el.getElementsByTagName("SUP")[0],
        badges[i].num > 99 ? 99 : badges[i].num,
        {
          duration: 3
        }
      ).start(() => {
        badges[i].countUp = true;
      });
    });
  },
  methods: {
    onReady(instance, CountUp0) {
      //   console.log("onReady", instance, CountUp0);
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
