<template>
  <div class="extjs-demo" id="extjsDemo"></div>
</template>

<script>
import { JsLoader } from "../common/utils/js-loader";

export default {
  name: "extjs-demo",
  data() {
    return {};
  },
  mounted() {
    window.extjsDemo = this;
    JsLoader(
      ["./static/extjs6.0/theme-all.css", "./static/extjs6.0/index.js"],
      this.init
    );
  },
  methods: {
    init() {
      const TestClass = Ext.define("testClass", {
        extend: "Ext.panel.Panel",
        renderTo: this.$el,
        // baseCls: "baseCls-test", // 在类定义时使用，不能动态 setBaseCls
        // classCls: "classCls-test", // 子类的 classCls 会和父类的 classCls
        cls: "cls-test", // 既可以定义类时使用，也可以实例化时使用
        height: 200,
        // width: 600,
        title: "Hello world",
        html: "First Ext JS Hello World Program"
      });

      Ext.onReady(() => {
        // Ext.create("testClass")
        this.panel = new TestClass({
          id: "id20190702"
        });

        this.dateField = new Ext.form.DateField({
          id: "crtDateForSearch",
          fieldLabel: "创建日期",
          width: 100,
          format: "Y-m-d",
          emptyText: "创建时间"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.extjs-demo {
}
</style>
