<template>
  <div class="app-tip-hidden" v-html="msgHtml"></div>
</template>

<script>
export default {
  name: "app-tip",
  data() {
    return {
      msgHtml: ""
    };
  },
  mounted() {
    this.$root.AppTip = this;
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
  },
  beforeDestroy() {
    this.$root.AppTip = null;
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
