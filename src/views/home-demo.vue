<template>
  <div class="demo">
    <el-button class="demo-back" @click.stop="onBack">
      <i class="el-icon-back"></i>
    </el-button>
    <div v-if="!isCompReady" class="link-list">
      <el-link
        type="primary"
        v-for="(val, key) in componentMap"
        :key="key"
        :underline="false"
        :href="'#/demo/' + key"
      >{{key}}</el-link>
    </div>
    <component v-else :is="compName"></component>
  </div>
</template>

<script>
import Vue from "vue";
import { getDemoComponent } from "../components/demo/index";

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
      componentMap: this.$demoComponentMap
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
          this.$NProgress.start();
          getDemoComponent(compName).then(o => {
            Vue.component(compName, o.default);
            this.componentMap[compName] = true;
            this.$NProgress.done();
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

<style lang="scss" scoped>
.demo {
  height: 100%;
  position: relative;
}

.link-list {
  padding-top: 10px;

  a {
    font-size: 22px;
    border: 1px solid #2ba5b8;
    border-radius: 10px;
    padding: 10px;
    margin: 5px;

    &:hover {
      background-color: #72979c;
      color: white;
    }
  }
}

.demo-back {
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom-left-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 100;
}
</style>
