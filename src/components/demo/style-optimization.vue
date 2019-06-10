<template>
  <div class="style-optimazation">
    <h3>Vue样式添加规范</h3>
    <el-collapse>
      <el-collapse-item title="①基础样式">
        <p>原生html标签样式、element-ui等外部组件库的默认样式，而在main.js中导入node_modules中的样式均打包在chunk-vendors.css中</p>
        <p style="white-space: pre-wrap;">
          /src/style/index.css // 原生html标签样式
          /src/style/element-ui.css // 修改element-ui样式后的默认样式
          导入这些css后均打包在app.css中，此样式文件次于chunk-vendors.css后加载
        </p>
      </el-collapse-item>
      <el-collapse-item title="②功能样式">
        <p>以功能关键词作为样式类，添加至body中</p>
        <p style="white-space: pre-wrap;">
          以登录功能为例子，关键词login
          /src/style/login.scss中 .login { input { width: 180px; } // 定义默认输入框的宽度}
          将该scss文件导入到index中，或导入至对应的login组件中（或添加scoped）
        </p>
      </el-collapse-item>
      <el-collapse-item title="③vue组件样式">
        <p>以组件关键词作为样式类样式</p>
        <p style="white-space: pre-wrap;">
          以登录组件为例子，login.vue
          非scoped样式： .login { input { height: 50px; }// 定义默认输入框的高度} // 打包在app.css中
          scoped样式： .login { .login-submit { width: 100px; } } // 或打包在app.css中
        </p>
      </el-collapse-item>
      <el-collapse-item title="④理想样式加载">
        <p style="white-space: pre-wrap;">
          在html中，理想加载顺序如下(以head中样式的顺序为标准)：
          css/chunk-vendors.css
          css/app.css
          js/chunk-vendors.js
          js/app.js
        </p>
      </el-collapse-item>
      <el-collapse-item title="⑤规范命名样式">
        <p style="white-space: pre-wrap;">
          首先是否需要添加样式，可从已有样式资源中判断，或在界面中直接观察；
          然后命名样式需综合考虑后再命名，可从已有样式查找类似命名，如无类似命名后再根据实际用途命名；
          其次，如果重复使用命名样式并且大范围使用，则应抽取到公共样式文件中；否则根据情况来是否添加scoped；
          最后，尽量避免添加关键词前缀来叠加样式类，而推荐多层父类选择来叠加样式类。
          规范有：BEM
        </p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.style-optimazation {
  h3 {
    padding: 10px;
  }
}
</style>

<style lang="scss">
.style-optimazation {
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    padding: 0 10px;
  }
}
</style>
