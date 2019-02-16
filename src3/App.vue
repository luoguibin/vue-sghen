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
                <span class="bold">计算属性</span> 是基于它们的依赖进行缓存的。
            </p>
            <p>
                <span class="bold">侦听器watch</span> 可响应数据的变化,当需要在数据变化时执行异步或开销较大的操作时，次方法最有用。
            </p>
            <p>用
                <span class="bold">key</span> 管理可复用的元素,Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。</p>
        </div>

        <div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
    };
  },
  mounted() {
    window.vApp = this;
    this.$root.getDynamicComponent('dyna0').then(o => {
        Vue.component("dyna0", o.default);
    }).catch(e => {
        // console.log("dyna0 load error")
    });
  },
  methods: {}
};
</script>

<style lang="css" scoped>
.bold {
  font-weight: bold;
}
</style>
