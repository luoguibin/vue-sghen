<template>
  <div class="selfdrap-demo">
    <el-button-group>
      <el-button @click="addDrapItem">addDrapItem</el-button>
      <el-button @click="removeDrapItem">removeDrapItem</el-button>
    </el-button-group>

    <svg xmlns="http://www.w3.org/2000/svg" @click="drapIndex = null">
      <line-item v-for="lineItem in lineItems" :key="lineItem.id" :obj="lineItem" />
    </svg>

    <div ref="drapPanel" class="drap-panel">
      <drap-item
        v-for="(drapItem, index) in drapItems"
        :key="drapItem.id"
        :obj="drapItem"
        :class="{'drap-item_focus': drapIndex === index}"
      ></drap-item>
    </div>
  </div>
</template>

<script>
const DrapItemComp = {
  name: "drap-item",

  props: {
    obj: {
      type: String,
      default: function() {
        const date = new Date();
        return {
          id: date.getTime(),
          content: date.toString(),
          position: {
            left: 0,
            default: 0
          },
          size: {
            width: 0,
            height: 0
          }
        };
      }
    }
  },

  data() {},

  mounted() {
    const el = this.$el,
      size = this.obj.size;
    size.width = el.clientWidth;
    size.height = el.clientHeight;
  },

  computed: {
    elStyle() {
      const p = this.obj.position;
      return {
        left: p.left + "px",
        top: p.top + "px"
      };
    }
  },

  render(h) {
    const obj = this.obj;
    return h(
      "div",
      {
        class: {
          "drap-item": true
        },
        style: this.elStyle
      },
      [
        h("span", {
          class: {
            "drap-point_top": true
          },
          attrs: {
            "drap-type": "point-top"
          }
        }),
        h("div", {
          class: {
            "drap-box": true
          },
          attrs: {
            "drap-type": "drap-box"
          },
          domProps: {
            innerHTML: obj.content
          }
        })
      ]
    );
  }
};

const LineItemComp = {
  name: "line-item",

  props: {
    obj: {
      type: Object,
      required: true
    }
  },

  render(h) {
    const startItem = this.obj.startItem,
      endItem = this.obj.endItem;

    const sLeft = startItem.position.left + startItem.size.width / 2,
      sTop = startItem.position.top,
      eLeft = endItem.position.left + endItem.size.width / 2,
      eTop = endItem.position.top;
    const path = `M ${sLeft} ${sTop} L ${eLeft} ${eTop}`;
    return h("path", {
      attrs: {
        d: path,
        stroke: "#0096f2",
        "stroke-width": 2
      }
    });
  }
};

export default {
  name: "selfdrap-demo",

  components: {
    "drap-item": DrapItemComp,
    "line-item": LineItemComp
  },

  data() {
    return {
      drapItems: [],
      drapIndex: null,
      drapType: null,
      lineItems: []
    };
  },

  created() {
    window.selfdrapDemo = this;
    for (let i = 0; i < 3; i++) {
      this.drapItems.push({
        id: i,
        content: "content" + i,
        position: {
          left: 100 * (i + 1),
          top: 50
        },
        size: { width: 0, height: 0 }
      });
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.$refs.drapPanel.addEventListener("mousedown", e => {
        this.drapType = null;
        this.drapIndex = null;

        const target = e.target,
          drapType = target.getAttribute("drap-type");
        if (!drapType) {
          return;
        }

        const drapIndex = this.getDragItemIndex(target);
        const drapItem = this.drapItems[drapIndex];
        console.log(drapType, drapIndex);

        this.drapIndex = drapIndex;
        this.drapType = drapType;
        this.x = e.clientX;
        this.y = e.clientY;

        switch (drapType) {
          case "drap-box":
            break;
          case "point-top":
            const endItem = this.addDrapItem(true);
            endItem.position = { ...drapItem.position };
            endItem.position.left += drapItem.size.width / 2;
            this.lineItems.push({
              startItem: drapItem,
              endItem
            });
            break;
          default:
            return;
        }
        this.$refs.drapPanel.addEventListener("mousemove", this.moveE);
      });

      this.moveE = e => {
        const addX = e.clientX - this.x,
          addY = e.clientY - this.y;

        this.x = e.clientX;
        this.y = e.clientY;

        switch (this.drapType) {
          case "drap-box":
            const drapItem = this.drapItems[this.drapIndex];
            drapItem.position.left += addX;
            drapItem.position.top += addY;
            break;
          case "point-top":
            const endItem = this.lineItems[this.lineItems.length - 1].endItem;
            endItem.position.left += addX;
            endItem.position.top += addY;
            break;
          default:
            return;
        }
      };

      this.$refs.drapPanel.addEventListener("mouseup", e => {
        const target = e.target,
          drapIndex = this.getDragItemIndex(target);

        switch (this.drapType) {
          case "drap-box":
            break;
          case "point-top":
            const drapType = target.getAttribute("drap-type");
            if (drapType) {
              const lineItem = this.lineItems[this.lineItems.length - 1];
              lineItem.endItem = this.drapItems[drapIndex];
            } else {
              this.lineItems.pop();
            }
            break;
          default:
            return;
        }

        this.drapType = null;
        this.$refs.drapPanel.removeEventListener("mousemove", this.moveE);
      });
    },

    // todo:
    getDragItemIndex(el) {
      if (!el) {
        return null;
      }
      const drapPanel = this.$refs.drapPanel;
      let preEl = el;
      el = el.parentElement;
      while (el && el !== drapPanel) {
        preEl = el;
        el = el.parentElement;
      }
      if (!el) {
        return null;
      }
      el = preEl;

      let index = 0;
      while (el.previousElementSibling) {
        el = el.previousElementSibling;
        index++;
      }
      return index;
    },

    addDrapItem(onlyNew) {
      const date = new Date();
      const drapItem = {
        id: date.getTime(),
        content: "content" + date.getTime(),
        position: {
          left: 100,
          top: 50
        },
        size: { width: 0, height: 0 }
      };
      if (onlyNew === true) {
        return drapItem;
      }
      this.drapItems.push(drapItem);
      return drapItem;
    },

    removeDrapItem() {
      const drapIndex = this.drapIndex;
      if (drapIndex !== null) {
        const drapId = this.drapItems[drapIndex];
        this.lineItems = this.lineItems.filter(o => {
          return o.endItem.id === drapId || o.endItem.id === drapId;
        });

        this.drapItems.splice(drapIndex, 1);
        this.drapIndex = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.selfdrap-demo {
  position: relative;
  height: 100%;

  /deep/.drap-item {
    position: absolute;
    display: inline-block;
    border: 1px solid gainsboro;
    background-color: white;
    cursor: pointer;

    /* key class */
    .drap-point_top {
      position: absolute;
      top: 0;
      left: 50%;
      width: 20px;
      height: 10px;
      border-radius: 20px 20px 0 0;
      background-color: green;
      transition: transform 300ms;
      transform: translate(-50%, -100%) scale(1);
      transform-origin: center bottom;
      user-select: none;

      &:hover {
        transform: translate(-50%, -100%) scale(1.2);
      }
    }

    /* key class */
    .drap-box {
      padding: 10px;
      user-select: none;
    }
  }

  .drap-item_focus {
    border: 1px solid #148acf;
  }

  .drap-panel {
    height: 100%;
  }

  svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .el-button-group {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }
}
</style>