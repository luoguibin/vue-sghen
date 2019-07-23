<script>
import Vue from "vue";
import Header from "./Header";
import LoadingComp from "./components/loading-comp";
import ErrorComp from "./components/error-comp";

export default {
  name: "app",
  components: {
    "my-header": Header,
    "loading-comp": LoadingComp,
    "error-comp": ErrorComp
  },
  data() {
    return {
      renderComp: null,
      backText: "<-"
    };
  },

  created() {
    window.app2 = this;

    // 禁止被观察
    this.renderData = null;
  },

  render(h) {
    const children = [];
    children.push(
      h("div", {}, [
        h("my-header", {
          ref: "myHeader",
          props: { backText: this.backText },
          on: {
            back: (data, e) => {
              console.log(data, e);
            }
          }
        }),
        h("el-button", {
          domProps: { innerHTML: "hello0" },
          on: {
            click: e => {
              this.renderComponent("hello0");
            }
          }
        }),
        h("el-button", {
          domProps: { innerHTML: "hello1" },
          on: {
            click: e => {
              this.renderComponent("hello1");
            }
          }
        }),
        h("el-button", {
          domProps: { innerHTML: "hello2" },
          on: {
            click: e => {
              this.renderComponent("hello2");
            }
          }
        })
      ])
    );
    if (this.renderComp) {
      children.push(h(this.renderComp, this.renderData));
    }

    return h(
      "div",
      {
        class: {
          app: true
        }
      },
      children
    );
  },

  methods: {
    /**
     * 引入组件js文件
     */
    renderComponent(name) {
      this.renderComp = "loading-comp";
      this.renderData = null;
      clearTimeout(this.handle);

      this.handle = setTimeout(() => {
        this.loadComponent(name)
          .then(o => {
            window.testO = o;
            this.renderComp = o.default;
          })
          .catch(err => {
            console.log("load error", err);
            this.renderComp = "error-comp";
            this.renderData = { props: { code: err.code } };
          });
      }, 500 + Math.floor(Math.random() * 2000));
    }
  }
};
</script>

<style lang="scss" scoped>
.app {
}
</style>

<style lang="scss">
</style>
