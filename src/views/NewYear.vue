<template>
    <div class="new-year">
        <component v-if="compName" :is="compName"></component>
        <div v-else class="year-none">
            <h1 style="margin-bottom: 5%;">不知天上宫阙，今夕是
                <span v-if="!showAnimeYear" class="he-anime" ref="heEl">何</span>
                <year-num v-else></year-num>
                年～</h1>
        </div>

    </div>
</template>

<script>
import Vue from "vue";
import YearNum from "@/components/year/YearNum";

export default {
  name: "NearYear",
  components: {
    "year-num": YearNum
  },
  data() {
    return {
      compName: "",
      showAnimeYear: false,
      componentMap: {
        Year2019: true
      }
    };
  },
  mounted() {
    window.newYear = this;
    setTimeout(() => {
      this.init(this.$route.query.year);
    }, 0);
  },
  methods: {
    init(year) {
      let compName = "Year";
      if (year) compName += year;
      if (compName && this.componentMap[compName]) {
        import("@/components/year/" + compName).then(o => {
          if (!Vue.component(compName)) {
            Vue.component(compName, o.default);
          }
          this.compName = compName;
        });
      } else {
        if (!this.showAnimeYear) {
          const style = this.$refs.heEl.style;
          style.opacity = 0.5;
          style.width = "192px";
          style.transform = "scale(2.5)";
          setTimeout(() => {
            this.showAnimeYear = true;
            this.init();
          }, 2000);
        } else {
          setTimeout(() => {
            this.init(new Date().getFullYear());
          }, 2000);
        }
      }
    }
  }
};
</script>

<style scoped>
.new-year {
  height: 100%;
  overflow: hidden;
}

.year-none {
  margin-top: 20%;
  text-align: center;
}

.he-anime {
  width: 33px;
  opacity: 1;
  display: inline-block;
  transition: all 1200ms;
}
</style>
