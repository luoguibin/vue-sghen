<template>
  <div v-show="showMsg" class="app-tip" v-html="msgHtml"></div>
</template>

<script>
export default {
  name: "AppTip",
  data() {
    return {
      showMsg: false,
      msgHtml: ""
    };
  },
  methods: {
    show(msgHtml, duration) {
      if (!msgHtml) return;

      this.msgHtml = msgHtml;
      this.showMsg = true;
      this.hide();

      this.handle = setTimeout(() => {
        this.showMsg = false;
        this.handle = null;
      }, duration || 2000);
    },
    hide() {
      if (this.handle) {
        clearTimeout(this.handle);
      }
    }
  },
  beforeDestroy() {
    this.hide();
  }
};
</script>

<style scoped>
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
