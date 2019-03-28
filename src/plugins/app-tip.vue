<template>
  <div class="app-tip-hidden" v-html="msgHtml"></div>
</template>

<script>
export default {
  name: "AppTip",
  data() {
    return {
      msgHtml: ""
    };
  },
  methods: {
    show(msgHtml) {
      if (!msgHtml) return;

      this.msgHtml = msgHtml;
      const classList = this.$el.classList;
      classList.add("app-tip");

      this.handle = setTimeout(() => {
        classList.remove("app-tip");
        this.handle = null;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.app-tip-hidden {
  display: none;
}

.app-tip {
  display: block;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
}
</style>
