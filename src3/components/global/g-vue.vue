<template>
  <div id="g-hello">
    <div :class="$style[className]">
      <p>Vue(2.x) (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。</p>
    </div>

    <div style="margin-top: 20px;">
      <p>以
        <bdi>_</bdi>或
        <bdi>$</bdi>开头的属性 不会 被 Vue 实例代理，因为它们可能和 Vue 内置的属性、API 方法冲突。可以使用例如 vm.$data._property 的方式访问这些属性。</p>
      <p>
        <bdi>计算属性</bdi> 是基于它们的依赖进行缓存的。</p>
      <p>
        <bdi>侦听器watch</bdi> 可响应数据的变化,当需要在数据变化时执行异步或开销较大的操作时，次方法最有用。</p>
      <p>用
        <bdi>key</bdi> 管理可复用的元素,Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。</p>
      <p>Vue 不能检测到对象属性的添加或删除。Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上。添加多个属性可用: this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })</p>
      <p>Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。this.$nextTick()自动绑定当前vue实例，而Vue.nextTick()则是全局，需要使用箭头函数。</p>
      <p>使用 $parent 属性无法很好的扩展到更深层级的嵌套组件上。这也是依赖注入的用武之地，它用到了两个新的实例选项：
        <bdi>provide</bdi> 和
        <bdi>inject</bdi>。其两者主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。</p>
      <p>Vue生命周期 mounted 不会承诺所有的子组件也都一起被挂载，特别是子组件是异步组件。</p>
      <p>
        <bdi>keep-alive</bdi> 要求同时只有一个子元素被渲染</p>
      <p>父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。</p>

      <fieldset>
        <legend>
          <button @click="onLoadDMixTest">onLoadDMixTest</button>
        </legend>
        <component v-if="hasDMixTest" :is="dMixTestName"></component>
      </fieldset>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      txt: "g-hello",
      className: "g-hello",
      hasDMixTest: false,
      dMixTestName: "d-mix-test"
    };
  },
  inject: {
    getApp2: "getApp"
  },
  // inject: ['getApp']
  mounted() {
    // console.log(this.getApp2().$options.name);
    // console.log(this.$attrs, this.$listeners);
    // console.log(this.$style);

    window.gHello = this;
    let obj = {};
    this.$once("hook:beforeDestroy", () => {
      obj = null;
    });
  },
  methods: {
    onLoadDMixTest() {
      if (this.hasDMixTest) return;
      const name = this.dMixTestName;

      this.getDynaComp(name).then(o => {
        if (Vue.component(name)) return;

        const comp = o.default;
        if (name.indexOf("d-mix-") === 0) {
          let mixins = comp.mixins;
          if (!mixins) {
            mixins = [];
            comp.mixins = mixins;
          }
          mixins.push({
            created() {
              console.log("mixins::created()");
            }
          });
        }

        Vue.component(name, comp);
        this.hasDMixTest = true;
      });
    }
  }
};
</script>

<style scoped>
#g-hello {
  background-color: white;
  overflow: hidden;
}

bdi {
  font-weight: bold;
}

p {
  font-size: 16px;
  text-indent: 2em;
  line-height: 1.8em;
}
</style>


<style module>
.g-hello {
  font-size: 25px;
  font-weight: bold;
}
</style>
