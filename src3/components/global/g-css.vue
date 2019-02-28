<template>
    <div class="g-css">
        <p>
            <span class="bold">z-index</span>只对指定了position属性的元素有效。<br /> Stacking without z-index : 默认的摆放规则，即不含有 z-index 属性时<br /> Stacking and float : 浮动元素的处理方式<br /> Adding z-index : 使用 z-index 来改变堆放顺序<br /> The stacking context : 内容堆放注意事项<br /> Stacking context example 1 : 在两层元素的第二层上使用 z-index<br /> Stacking context example 2 : 在两层元素的所有层上使用 z-index<br /> Stacking context example 3 : 在三层元素的第二层上使用 z-index<br />
        </p>
    </div>
</template>

<script>
export default {
  name: "GCss"
};
</script>

<style scoped>
.g-css {
  padding: 10px;
}

.bold {
  font-weight: bold;
}

p {
    font-size: 16px;
}
</style>
