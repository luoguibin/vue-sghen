<template>
  <div class="js-cookie-demo">
    <p>监听document的visibilitychange事件，JsCookie刷新对应的cookie，但是同时打开两个浏览器窗口(非网页标签)则不会触发</p>
    <div>
      <span>id</span>
      <input v-model.number="keyVals.id" />
    </div>
    <div>
      <span>name</span>
      <input v-model="keyVals.name" />
      </div>
    <div>
      <span>token</span>
      <input v-model="keyVals.token" />
    </div>

    <button type="primary" @click="onSave">保存</button>
    <button type="primary" @click="onDelete">移除</button>
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
      const visibilitychange = () => {
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