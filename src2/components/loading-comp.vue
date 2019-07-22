<script>
export default {
  data() {
    return {
      height: 100
    };
  },

  created() {
    console.log("LoadingComponent created()");
  },

  render(h) {
    return h("div", {
      style: {
        height: this.height + "px"
      },
      directives: [
        {
          name: "loading",
          rawName: "v-loading",
          value: true,
          expression: "true"
        }
      ]
    });
  }
};
</script>
