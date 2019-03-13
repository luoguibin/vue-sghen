<template>
  <div class="g-css">
    <fieldset>
      <legend>z-index</legend>
      <p>
        <span class="bold">z-index</span>只对指定了position属性的元素有效。<br /> Stacking without z-index : 默认的摆放规则，即不含有 z-index 属性时<br /> Stacking and float : 浮动元素的处理方式<br /> Adding z-index : 使用 z-index 来改变堆放顺序<br /> The stacking context : 内容堆放注意事项<br /> Stacking context example 1 : 在两层元素的第二层上使用 z-index<br /> Stacking context example 2 : 在两层元素的所有层上使用 z-index<br /> Stacking context example 3 : 在三层元素的第二层上使用 z-index<br />
      </p>
    </fieldset>
    <fieldset>
      <legend>fixed</legend>
      <p>
        <span class="bold">position:fixed</span> 定位的错位，其祖先节点的可能有以下CSS属性： 1.transform 属性值不为 none 的元素 2.perspective 值不为 none 的元素 3.在 will-change 中指定了任意 CSS 属性
      </p>
    </fieldset>
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
