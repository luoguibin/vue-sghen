<template>
  <div class="form-table">
    <!-- 头部搜索框 -->
    <el-form
      v-if="formData"
      ref="form"
      class="form-table_search"
      :model="formData"
      :rules="formRules"
      :inline="inline"
      :label-width="labelWidth"
    >
      <!-- 常规选项 -->
      <el-form-item
        v-for="item in formProps"
        v-show="!item.hidden"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :label-width="item.labelWidth"
      >
        <!-- 下拉选择 -->
        <el-select
          v-if="item.target === 'select'"
          v-model="formData[item.prop]"
          :style="item.style"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          @change="onFormDataChange(item)"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>

        <!-- 级联选择 -->
        <el-cascader
          v-else-if="item.target === 'cascader'"
          v-model="formData[item.prop]"
          :style="item.style"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :options="item.options"
          @change="onFormDataChange(item)"
        ></el-cascader>

        <!-- 数字输入框 -->
        <el-input
          v-else-if="item.target === 'number'"
          v-model.number="formData[item.prop]"
          :style="item.style"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
        ></el-input>

        <!-- 开关 -->
        <el-switch
          v-else-if="item.target === 'switch'"
          v-model="formData[item.prop]"
          :active-text="item.activeText"
          :inactive-text="item.inactiveText"
        ></el-switch>

        <!-- span文本显示 -->
        <span v-else-if="item.target === 'span'">{{formData[item.prop]}}</span>

        <slot v-else-if="item.slot" :name="item.slot" :data="formData"></slot>

        <!-- 常规字符输入框 -->
        <el-input
          v-else
          v-model="formData[item.prop]"
          :style="item.style"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
        ></el-input>
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item :label-width="inline ? '' : labelWidth">
        <el-button type="primary" @click="onConfirm">{{confirmText}}</el-button>
        <slot name="form-end"></slot>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <el-table
      v-if="tableData"
      ref="table"
      class="form-table_main"
      :data="tableData"
      border
      v-loading="tableLoading"
    >
      <el-table-column
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || 'auto'"
      >
        <template slot-scope="scope">
          <!-- 普通文本按钮 -->
          <el-button
            v-if="item.target === 'button'"
            :type="item.buttonType"
            @click="onTableDataClick(scope.row, item)"
          >{{item.changeText ? item.changeText(scope.row, item.prop) : scope.row[item.prop]}}</el-button>

          <!-- span文本修饰 -->
          <span
            v-else-if="item.target === 'span'"
            :class="item.class ? item.class(scope.row, item.prop) : ''"
          >{{item.changeText ? item.changeText(scope.row, item.prop) : scope.row[item.prop]}}</span>

          <!-- 插槽作用 -->
          <slot v-else-if="item.slot" :name="item.slot" :data="scope.row">-</slot>

          <!-- 默认文本 -->
          <template
            v-else
          >{{item.changeText ? item.changeText(scope.row, item.prop) : scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
    </el-table>

    <slot name="pagination"></slot>
  </div>
</template>

<script>
export default {
  name: "form-table",
  props: {
    formProps: {
      type: Array,
      default: function() {
        return [
          {
            prop: "id",
            label: "ID",
            target: "number",
            disabled: false,
            rules: [{ required: true, message: "ID不能为空" }],
            placeholder: "请输入ID"
          },
          {
            prop: "color",
            label: "颜色",
            target: "select",
            style: { width: "180px" },
            rules: [
              { required: true, message: "请选择颜色" },
              {
                validator: (rule, value, callback) => {
                  console.log(rule, value);
                  if (value && value === this.formData.color2) {
                    callback();
                  } else {
                    callback("与主颜色不相同");
                  }
                }
              }
            ],
            options: [
              { value: "red", label: "红" },
              { value: "green", label: "绿" },
              { value: "blue", label: "蓝" }
            ],
            call: (data, option) => {
              console.log(data, option);
            }
          },
          {
            prop: "color2",
            label: "主颜色",
            disabled: true,
            rules: [{ required: true, message: "主颜色未设置" }]
          },
          {
            prop: "color3",
            label: "副颜色",
            disabled: true,
            hidden: true
          }
        ];
      }
    },
    formData: {
      type: Object,
      default: function() {
        return {
          // id: 1001,
          // color: "red"
          color2: "red"
        };
      }
    },
    tableColumns: {
      type: Array,
      default: function() {
        return [
          { prop: "id", label: "ID" },
          {
            prop: "name",
            label: "名字",
            changeText(obj, key) {
              return obj[key] + "(-)";
            }
          }
        ];
      }
    },
    tableData: {
      type: Array,
      default: function() {
        return [
          { id: 1001, name: "liming" },
          { id: 1002, name: "xiaoming" },
          { id: 1003, name: "daming" }
        ];
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    inline: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: "100px"
    }
  },

  created() {
    window.formTable = this;
  },

  computed: {
    /**
     * 计算缓存表单验证
     */
    formRules() {
      const rules = {};
      this.formProps.forEach(formProp => {
        if (formProp.rules) {
          rules[formProp.prop] = formProp.rules;
        }
      });
      return rules;
    }
  },

  methods: {
    /**
     * 表单确认
     */
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("confirm", this.formData);
          this.$message("提交成功");
          console.log(this.formData);
        }
      });
    },

    /**
     * 表格数据点击
     * @param {Objecy} obj 数据对象
     * @param {Object} option 字段配置对象
     */
    onTableDataClick(obj, option) {
      if (option.call) {
        option.call(obj, option);
      } else {
        this.$emit("data-click", obj, option);
      }
    },

    /**
     * 表单数据改变
     * @param {Object} option 字段配置对象
     */
    onFormDataChange(option) {
      if (option.call) {
        option.call(this.formData, option);
      } else {
        this.$emit("data-change", this.formData, option);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-table {
}
</style>

<style lang="scss">
.form-table {
}
</style>
