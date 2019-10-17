<template>
  <div class="js-cookie-demo">
    <p>监听document的visibilitychange事件，刷新对应的cookie</p>
    <el-input v-model.number="keyVals.id">
      <span slot="prepend">id</span>
    </el-input>
    <el-input v-model="keyVals.name">
      <span slot="prepend">name</span>
    </el-input>
    <el-input v-model="keyVals.token">
      <span slot="prepend">token</span>
    </el-input>

    <el-button type="primary" @click="onSave">保存</el-button>
    <el-button type="primary" @click="onDelete">移除</el-button>
  </div>
</template>

<script>
import JsCookie from "js-cookie";

export default {
  name: "js-cookie-demo",

  data() {
    return {
      keyVals: {}
    };
  },

  created() {
    this.init();
    this.refreshKeyVals();
  },

  methods: {
    init() {
      const visibilitychange = e => {
        console.log(
          "visibilitychange",
          document.visibilityState,
          document.hidden
        );

        if (!document.hidden) {
          this.refreshKeyVals();
        }
      };
      document.addEventListener("visibilitychange", visibilitychange);
      this.$once("hook:beforeDestroy", () => {
        console.log("remove visibilitychange");
        document.removeEventListener("visibilitychange", visibilitychange);
      });
    },
    refreshKeyVals() {
      const keyValsStr = JsCookie.get("key-vals");
      if (keyValsStr) {
        this.keyVals = JSON.parse(keyValsStr);
      } else {
        this.keyVals = {};
      }
    },
    onSave() {
      JsCookie.set("key-vals", this.keyVals);
    },

    onDelete() {
      JsCookie.remove("key-vals");
    }
  }
};
</script>

<style scoped>
.js-cookie-demo {
}
</style>