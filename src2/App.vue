<script>
import Vue from "vue";
import Header from "./Header";

const LoadingComponent = {
  data() {
    return {
      height: 100
    };
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

export default {
  name: "app",
  components: {
    "my-header": Header
  },
  data() {
    return {
      renderComp: null,
      backText: "<-"
    };
  },

  created() {
    window.app2 = this;
  },

  render(h) {
    const children = [];
    children.push(
      h("div", {}, [
        h("my-header", {
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
      children.push(h(this.renderComp));
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
      this.renderComp = Vue.component("loading-comp");
      if (!this.renderComp) {
        console.log("init loading-comp")
        Vue.component("loading-comp", LoadingComponent);
        this.renderComp = Vue.component("loading-comp");
      }

      setTimeout(() => {
        this.loadComponent(name)
          .then(o => {
            window.testO = o;
            this.renderComp = o.default;
          })
          .catch(err => {
            this.renderComp = {
              render(h) {
                return h("div", [
                  h("div", [
                    h("span", { domProps: { innerHTML: "code:&nbsp;" } }),
                    h("span", err.code)
                  ]),
                  h("div", [
                    h("span", { domProps: { innerHTML: "msg:&nbsp;" } }),
                    h("span", err.msg || "加载错误")
                  ])
                ]);
              }
            };
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
