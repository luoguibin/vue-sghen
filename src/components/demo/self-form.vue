<template>
  <div class="self-form">
    <el-form ref="form" :model="formData">
      <el-form-item
        v-for="(formProp, index) in formProps"
        :class="['el-form-item__' + formItemSuffix, (index + 1) % columnCount === 0 ? 'el-form-item__right' : '']"
        :key="formProp.prop"
        :label="formProp.label"
        :prop="formProp.prop"
        :label-width="formProp.width || '100px'"
        v-show="!formProp.hidden"
      >
        <!-- 数字输入框 -->
        <el-input v-if="formProp.define === 'number'" v-model.number="formData[formProp.prop]"></el-input>

        <!-- 文本显示 -->
        <template v-else-if="formProp.define === 'text'">{{formData[formProp.prop] || "-"}}</template>

        <!-- 插槽 -->
        <slot v-else-if="formProp.define === 'slot'" :name="formProp.prop">-</slot>

        <!-- 多行文本输入框 -->
        <el-input
          v-else-if="formProp.define === 'textarea'"
          type="textarea"
          v-model="formData[formProp.prop]"
        ></el-input>

        <!-- 下拉选择 -->
        <el-select v-else-if="formProp.define === 'select'" v-model="formData[formProp.prop]">
          <el-option
            v-for="option in formProp.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>

        <!-- 默认输入框 -->
        <el-input v-else v-model="formData[formProp.prop]" :disabled="formProp.disable">
          <!-- 后缀拼接 -->
          <el-button
            v-if="formProp.append"
            slot="append"
            @click="onPropAppend(formProp.append)"
          >{{formProp.append.label}}</el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "self-form",
  data() {
    return {
      formProps: [
        { label: "ID", prop: "id", width: "100px", define: "number" },
        {
          label: "名称",
          prop: "name",
          append: {
            label: "随机",
            call: () => {
              this.formData.name = "name" + Math.round(Math.random() * 100);
              this.formProps[2].hidden = Math.random() < 0.5;
            }
          }
        },
        { label: "隐藏信息", prop: "info", hidden: true, disable: true },
        { label: "创建时间", prop: "createTime", define: "text" },
        { label: "", prop: "slot-date", define: "slot" },
        {
          label: "颜色",
          prop: "color",
          define: "select",
          options: [
            { lable: "红色", value: "red" },
            { lable: "绿色", value: "green" },
            { lable: "蓝色", value: "blue" }
          ]
        },
        {
          label: "描述",
          prop: "description",
          define: "textarea"
        },
        // test props
        {
          label: "label00",
          prop: "label00"
        },
        {
          label: "label01",
          prop: "label01"
        },
        {
          label: "label02",
          prop: "label02"
        }
      ],
      formData: {
        id: 1001,
        name: "Li",
        createTime: new Date().getTime()
      },
      formItemSuffix: "",
      columnCount: 1
    };
  },
  mounted() {
    window.selfFrom = this;
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  methods: {
    onResize() {
      const width = this.$el.clientWidth;

      if (width < 650) {
        this.formItemSuffix = "small";
        this.columnCount = 1;
      } else if (width < 1000) {
        this.formItemSuffix = "middle";
        this.columnCount = 2;
      } else {
        this.formItemSuffix = "large";
        this.columnCount = 3;
      }
    },

    onPropAppend(append) {
      console.log("onPropAppend", append);
      if (append.call) {
        append.call();
      } else {
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style lang="scss" scoped>
.self-form {
  .el-form-item__small {
    // use default
  }

  .el-form-item__middle {
    width: 49%;
    margin-right: 2%;
  }

  .el-form-item__large {
    width: 32%;
    margin-right: 2%;
  }

  .el-form-item__right {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
.self-form {
  .el-form-item {
    display: inline-block;
    width: 100%;
    padding-right: 0;
    vertical-align: top;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>