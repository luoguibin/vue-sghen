<template>
  <div class="demo">
    <div class="demo-back" @click.stop="onBack">back</div>
    <component v-if="isCompReady" :is="compName"></component>
    <div v-else style="padding-top: 10px;">
      <router-link v-for="(val, key) in componentMap" :key="key" :to="'/demo/' + key" class="a-link">{{key}}</router-link>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "demo",
  props: {
    compName: {
      type: String,
      default: "list"
    }
  },
  data() {
    return {
      componentMap: {
        LabDomDemo: false,
        LineAdsorption: false,
        ShapeCut: false,
        WorkerDemo: false,
        PixiDemo: false
      }
    };
  },
  mounted() {
    console.log("Demo::mounted()");
    window.demo = this;
    this.initComp();
  },
  watch: {
    // $route(to, from) {
    //   if (to.name === "demo") {
    //     this.initComp();
    //   }
    // },
    compName() {
      console.log("compName", this.compName);
      this.initComp();
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     console.log(vm)
  //   })
  // },
  // beforeRouteUpdate(to, from, next) {
  //   console.log("beforeRouteUpdate()", to, from);
  //   next();
  // },
  // afterRouteLeave(to, from, next) {
  // },
  computed: {
    isCompReady() {
      const compName = this.compName;
      return compName && this.componentMap[compName];
    }
  },
  methods: {
    initComp() {
      const compName = this.compName;
      if (compName && this.componentMap[compName] !== undefined) {
        if (!this.componentMap[compName]) {
          import(/* webpackChunkName: "[request]" */"@/components/demo/" + compName).then(o => {
            if (!Vue.component(compName)) {
              Vue.component(compName, o.default);
            }
            this.componentMap[compName] = true;
          });
        }
      } else {
        // this.compName = "list";
        // 已对compName进行watch，并调用了次方法，则不能手动赋值
        this.$router.push({ path: "/demo/list" });
      }
    },
    onBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.demo {
  height: 100%;
  position: relative;
}

.a-link {
  padding: 10px;
  margin: 5px;
}

.demo-back {
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  z-index: 100;
}
</style>
