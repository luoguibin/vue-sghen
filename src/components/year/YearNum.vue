<template>
    <div class="year-num year-num-anime" :style="style" @click="randAnimYear()">
        <div v-for="(_, index) in numStyles" :key="index" :style="styles(index)" class="num-column" v-html="numsStr"></div>
    </div>
</template>

<script>
export default {
  name: "YearNum",
  data() {
    return {
      numStyles: [{ top: -10 }, { top: -10 }, { top: -10 }, { top: -10 }],
      numsStr: "",
      fontSize: 33,
      padding: 10
    };
  },
  created() {
    let numsStr = "";
    for (let i = 0; i < 10; i++) {
      numsStr += i + "<br>";
    }
    numsStr += "0";
    this.numsStr = numsStr;
  },
  mounted() {
    window.yearNum = this;
    this.randAnimYear();
  },
  computed: {
    style() {
      return {
        height: this.fontSize + this.padding * 2 + "px",
        fontSize: this.fontSize + "px",
        padding: this.padding + "px",
        lineHeight: this.fontSize + this.padding * 2 + "px"
      };
    },
    styles() {
      return index => {
        return {
          top: this.numStyles[index].top + "px",
          padding: "0 10px"
        };
      };
    }
  },
  methods: {
    randAnimYear() {
      const toYear = new Date().getFullYear();
      let fromYear = "";
      for (let i = 0; i < 4; i++) {
        fromYear += Math.floor(Math.random() * 10);
      }
      this.animeYearNum(fromYear, toYear);
    },
    animeYearNum(fromYear, toYear) {
      const fromNums = this.getNums(fromYear),
        toNums = this.getNums(toYear);

      const classList = this.$el.classList,
        numStyles = this.numStyles,
        padding = this.padding,
        lineHeight = padding * 2 + this.fontSize;
      classList.toggle("year-num-anime");
      fromNums.forEach((v, i) => {
        numStyles[i].top = -(v * lineHeight + padding);
      });

      setTimeout(() => {
        classList.toggle("year-num-anime");
        toNums.forEach((v, i) => {
          numStyles[i].top = -(v * lineHeight + padding);
        });
      }, 10);
    },
    getNums(year) {
      const numStrs = year.toString().split(""),
        nums = [];
      numStrs.forEach(o => {
        nums.push(parseInt(o));
      });
      return nums;
    }
  }
};
</script>

<style scoped>
.year-num {
  display: inline-block;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
  vertical-align: middle;
  font-weight: bold;
}

.num-column {
  display: inline-block;
  position: relative;
}

.year-num-anime .num-column {
  transition: top 1200ms ease;
}
</style>
