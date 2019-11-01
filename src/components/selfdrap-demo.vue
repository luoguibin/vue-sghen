<template>
  <div class="selfdrap-demo">
    <el-button-group>
      <el-button @click="addDrapItem">addDrapItem</el-button>
      <el-button @click="removeDrapItem">removeDrapItem</el-button>
    </el-button-group>

    <svg xmlns="http://www.w3.org/2000/svg">
      <line-item v-for="lineItem in lineItems" :key="lineItem.id" :obj="lineItem" />
    </svg>

    <div
      ref="drapPanel"
      class="drap-panel"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseOut"
    >
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

  data() {
    return {};
  },

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
        h("el-dropdown", { class: "drap-menu", attrs: { trigger: "click" } }, [
          h("i", { class: { "el-icon-more": true } }),
          h("el-dropdown-menu", [
            h("el-dropdown-item", {
              domProps: {
                innerHTML: "item-0"
              }
            }),
            h("el-dropdown-item", {
              domProps: {
                innerHTML: "item-1"
              }
            }),
            h("el-dropdown-item", {
              domProps: {
                innerHTML: "item-2"
              }
            })
          ])
        ]),
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

function getQPos(x0, y0, x1, y1) {
  const xv = x1 - x0,
    yv = y1 - y0,
    axv = Math.abs(xv),
    ayv = Math.abs(yv);

  const big = 1,
    small = 0,
    pos = { x: x0, y: y0 };

  if (xv > 0) {
    if (yv > 0) {
      // 右上角
      if (axv > ayv) {
        pos.x += axv * big;
        pos.y += ayv * small;
      } else {
        pos.x += axv * small;
        pos.y += ayv * big;
      }
    } else {
      // 右下角
      if (axv > ayv) {
        pos.x += axv * big;
        pos.y += ayv * small;
      } else {
        pos.x += axv * small;
        pos.y -= ayv * big;
      }
    }
  } else {
    if (yv > 0) {
      // 左上角
      if (axv > ayv) {
        pos.x -= axv * big;
        pos.y += ayv * small;
      } else {
        pos.x -= axv * small;
        pos.y += ayv * big;
      }
    } else {
      // 左下角
      if (axv > ayv) {
        pos.x -= axv * big;
        pos.y -= ayv * small;
      } else {
        pos.x -= axv * small;
        pos.y -= ayv * big;
      }
    }
  }
  return pos;
}

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
    const qPos = getQPos(sLeft, sTop, eLeft, eTop);
    const path = `M ${sLeft} ${sTop} Q ${qPos.x} ${qPos.y} ${eLeft} ${eTop}`;
    return h("path", {
      attrs: {
        d: path
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
          left: 200 * (i + 1),
          top: 100
        },
        size: { width: 0, height: 0 }
      });
    }
  },

  mounted() {},

  methods: {
    onMouseDown(e) {
      this.drapType = null;
      this.drapIndex = null;

      const target = e.target,
        drapType = target.getAttribute("drap-type");
      if (!drapType) {
        return;
      }

      const drapIndex = this.getDragItemIndex(target);
      const drapItem = this.drapItems[drapIndex];
      console.log("mousedown", drapType, drapIndex);

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
      this.$el.addEventListener("mousemove", this.onMouseMove);
    },

    onMouseMove(e) {
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
          // console.log(JSON.stringify(endItem.position));
          endItem.position.left += addX;
          endItem.position.top += addY;
          break;
        default:
          return;
      }
    },

    onMouseOut(e) {
      this.onMouseUp(e);
    },

    onMouseUp(e) {
      const target = e.target,
        drapIndex = this.getDragItemIndex(target);

      console.log("mouseup", this.drapType);
      switch (this.drapType) {
        case "drap-box":
          break;
        case "point-top":
          const drapType = target.getAttribute("drap-type");
          console.log(drapType, drapIndex);
          if (drapType) {
            const lineItem = this.lineItems[this.lineItems.length - 1];
            lineItem.endItem = this.drapItems[drapIndex];
          } else {
            this.lineItems.pop();
          }
          break;
        default:
          break;
      }

      this.drapType = null;
      this.$refs.drapPanel.removeEventListener("mousemove", this.onMouseMove);
    },

    getDragItemIndex(el) {
      const drapPanel = this.$refs.drapPanel;
      while (el) {
        if (el.parentElement === drapPanel) {
          break;
        } else {
          el = el.parentElement;
        }
      }
      if (!el) {
        return null;
      }

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
        const drapId = this.drapItems[drapIndex].id;
        console.log(drapId);
        this.lineItems = this.lineItems.filter(o => {
          return o.endItem.id !== drapId && o.endItem.id !== drapId;
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

    .drap-menu {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translate(0, -50%);
    }

    /* key class */
    .drap-box {
      padding: 10px 30px 10px 10px;
      user-select: none;
    }
  }

  .drap-item_focus {
    border: 1px solid #148acf;
    z-index: 10;
  }

  svg,
  .drap-panel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  svg path {
    stroke: rgb(0, 150, 242);
    stroke-width: 2;
    fill: transparent;
  }

  .el-button-group {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }
}
</style>