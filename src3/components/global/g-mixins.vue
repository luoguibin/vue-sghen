<template>
  <div class="g-mixins">
    <p>
      <span class="bold">extends</span>和
      <span class="bold">mixins</span>：// 打开调试窗口查看生命周期日志打印
    </p>
    <p>
      <span class="bold">extends</span>优先级比
      <span class="bold">mixins</span>的优先级高
    </p>
    <p>
      <span class="bold">mixins</span> 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。 Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。
    </p>
    <p>当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。比如，数据对象在内部会进行递归合并，在和组件的数据发生冲突时以组件数据优先。同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。</p>
    <p><strong>render与mixin结合使用例子：tooltip(鼠标点击显示，抬起隐藏)</strong></p>
  </div>
</template>

<script>
const mixinFunc = function(index) {
  return {
    data() {
      return {
        mixinId: index,
        mix3: "mixin"
      };
    },
    beforeCreate() {
      console.log("mixin beforeCreate");
    },
    created() {
      console.log(this.mixinId + "-mixin created");
    },
    beforeMount() {
      console.log(this.mixinId + "-mixin beforeMount");
    },
    mounted() {
      console.log(this.mixinId + "-mixin mounted");
    }
  };
};

const MExtend = {
  name: "Mextend",
  template: `<div>extendId={{extendId}}</div>`,
  data() {
    return {
      extendId: 2019,
      mix3: "Mextend"
    };
  },
  created() {
    console.log("extend::created() " + this.$options.name);
  },
  mounted() {
    console.log("extend::mounted");
  }
};

const tooltipMixin = {
  data() {
    return {
      showHello: false,
      position: { left: 0, top: 0, width: 0 }
    };
  },

  created() {
    window.tooltipMixin = this;

    const render = this.$options.render || this.$createElement;
    this.$options.render = (h, ...args) => {
      return h(
        "div",
        {
          attrs: {
            id: "g-mixins"
          }
        },
        [
          render.apply(this, [h, ...args]),
          h(
            "transition",
            {
              props: {
                name: "g-tooltip"
              }
            },
            [
              this.showHello
                ? h("div", {
                    domProps: {
                      innerHTML: "Hello, I'm a tooltip."
                    },
                    class: {
                      "g-tooltip": true
                    },
                    style: {
                      left: this.position.left + this.position.width / 2 + "px",
                      top: this.position.top + "px"
                    }
                  })
                : null
            ]
          )
        ]
      );
    };

    window.addEventListener("mousedown", e => {
      this.showHello = true;
      const el = e.target || this.$el;
      const rect = el.getBoundingClientRect();
      this.position = { top: rect.top, left: rect.left, width: rect.width };
    });
    window.addEventListener("mouseup", () => {
      this.showHello = false;
    });
  }
};

export default {
  name: "Global-Mixins",
  extends: MExtend,
  mixins: [mixinFunc(0), mixinFunc(1), tooltipMixin],
  data() {
    return {
      //   mixinId: 1000,
      id: 2019,
      mix3: "Global"
    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
    window.gMixins = this;
  },
  beforeMount() {
    console.log("beforeMount() mix3=" + this.mix3);
  },
  mounted() {
    console.log("mounted");
  }
};
</script>

<style scoped>
.g-mixins > p {
  text-indent: 2em;
  font-size: 16px;
}

.bold {
  font-weight: bold;
}

.g-tooltip {
  position: fixed;
  padding: 10px;
  background: white;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, 0);
}

.g-tooltip-enter-active,
.g-tooltip-leave-active {
  transition: opacity 0.3s;
}

.g-tooltip-enter,
.g-tooltip-leave-to {
  opacity: 0;
}
</style>
