<script>
export default {
  props: {
    code: {
      type: String | Number,
      default: 404
    },
    msg: {
      type: String,
      default: "未找到页面"
    }
  },
  created() {
    console.log("error component created");
  },

  render(h) {
    return h("div", [
      h("div", [
        h("span", { domProps: { innerHTML: "code:&nbsp;" } }),
        h("span", this.code)
      ]),
      h("div", [
        h("span", { domProps: { innerHTML: "msg:&nbsp;" } }),
        h("span", this.msg || "加载错误")
      ])
    ]);
  }
};
</script>
