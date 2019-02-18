<template>
    <div>
        <div>
            <h3 style="text-align: center;">Vue2.x</h3>
            <p>
                <span class="bold">Vue</span> (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。
            </p>
        </div>

        <div style="margin-top: 50px;">
            <p>
                <span class="bold">计算属性</span> 是基于它们的依赖进行缓存的。</p>
            <p>
                <span class="bold">侦听器watch</span> 可响应数据的变化,当需要在数据变化时执行异步或开销较大的操作时，次方法最有用。</p>
            <p>用
                <span class="bold">key</span> 管理可复用的元素,Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。</p>
            <p>Vue 不能检测到对象属性的添加或删除。Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上。添加多个属性可用: this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })</p>
            <p>Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。this.$nextTick()自动绑定当前vue实例，而Vue.nextTick()则是全局，需要使用箭头函数。</p>
            <p>使用 $parent 属性无法很好的扩展到更深层级的嵌套组件上。这也是依赖注入的用武之地，它用到了两个新的实例选项：provide 和 inject。</p>
        </div>

        <div>
            <g-hello></g-hello>
            <test-render>
                day day up
            </test-render>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import TestRender from "./components/test-render";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    "test-render": TestRender
  },
  mounted() {
    window.vApp = this;
    this.$root
      .getDynamicComponent("dyna0")
      .then(o => {
        Vue.component("dyna0", o.default);
      })
      .catch(e => {
        // console.log("dyna0 load error")
      });
  },
  provide() {
    return {
      getApp: () => {
        return this;
      }
    };
  },
  methods: {}
};
</script>

<style lang="css" scoped>
.bold {
  font-weight: bold;
}

p {
  text-indent: 2em;
}
</style>
