<script>
export default {
  name: "my-header",
  props: {
    backText: {
      type: String,
      default: "返回"
    }
  },
  created() {
    window.header = this;
  },
  render(h) {
    return h("div", [
      h("span", {
        domProps: {
          innerHTML: this.backText
        },
        on: {
          click: e => {
            this.$emit("back", { a: 123 }, e);
          }
        }
      }),
      h("el-divider", { attrs: { direction: "vertical" } }),
      h("h3", {
        style: { display: "inline-block" },
        domProps: { innerHTML: "面向Vue.render函数编程" }
      })
    ]);
  }
};
</script>
