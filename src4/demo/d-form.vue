<template>
  <div class="d-form">
    <a-button-group>
      <a-button @click="modalVisible = true">onNewColumn</a-button>
    </a-button-group>

    <a-modal :visible="modalVisible" title="输入字段" @ok="handleOk" @cancel="modalVisible = false">
      <a-input v-model="columnName"></a-input>
    </a-modal>

    <a-form :form="form" @submit="handleSubmit">
      <a-form-item
        v-for="(column, key) in formColumns"
        :key="key"
        :label="column.label"
        :label-col="formConfig.labelCol"
        :wrapper-col="formConfig.wrapperCol"
      >
        <a-select
          v-if="column.labelType === 'select'"
          v-decorator="column.decorator"
          placeholder="请选择性别"
          @change="handleSelectChange($event, key)"
        >
          <a-select-option
            v-for="option in column.options"
            :key="option.value"
            :value="option.value"
          >{{option.label}}</a-select-option>
        </a-select>
        <a-input v-else v-decorator="column.decorator" allowClear />
      </a-form-item>

      <a-form-item
        :wrapper-col="{ span: formConfig.wrapperCol.span, offset: formConfig.labelCol.span }"
      >
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "d-form",

  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      formConfig: {
        labelCol: { span: 5 },
        wrapperCol: { span: 12 }
      },
      formColumns: {
        name: {
          label: "姓名",
          labelType: "input",
          decorator: [
            "name",
            {
              initialValue: "sghen",
              rules: [
                {
                  required: true,
                  message: "请输入姓名",
                  min: 1,
                  max: 128,
                  whitespace: true
                }
              ]
            }
          ]
        },
        gender: {
          label: "性别",
          labelType: "select",
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" }
          ],
          //   valueType: "string",
          decorator: [
            "gender",
            {
              rules: [{ required: true, message: "请选择性别" }],
              initialValue: "male"
            }
          ]
        },
        age: {
          label: "年龄",
          labelType: "input",
          valueType: "number",
          decorator: [
            "age",
            {
              initialValue: 18,
              rules: [
                {
                  required: true,
                  validator(rule, value, callback) {
                    if (/^[1-9][0-9]{0,1}$/.test(value)) {
                      callback();
                    } else {
                      callback("请输入年龄(0~99)");
                    }
                  }
                  //   transform(val) {
                  //     console.log("transform", val);
                  //     return val;
                  //   }
                }
              ],
              //    trigger: "blur",
              validateTrigger: "blur"
              //   getValueFromEvent(e) {
              //     const value = e.target.value;
              //     if (/^[1-9][0-9]{0,1}$/.test(value)) {
              //       return +value;
              //     } else {
              //       return value;
              //     }
              //   }
            }
          ]
        }
      },

      modalVisible: false,
      columnName: ""
    };
  },

  created() {
    window.dForm = this;
    this.addColumnName("address");
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const formColumns = this.formColumns,
            object = values;
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              switch (formColumns[key].valueType) {
                case "number":
                  values[key] = +values[key];
                  break;

                default:
                  break;
              }
            }
          }
          console.log("Received values of form: ", values);
        }
      });
    },

    handleSelectChange(value) {
      console.log(value);
    },

    handleOk() {
      this.addColumnName(this.columnName);
    },

    addColumnName(columnName) {
      if (!columnName) {
        return this.$message.error("字段名为空");
      }
      if (this.formColumns[columnName]) {
        return this.$message.error("表单已有该字段");
      }
      this.modalVisible = false;

      this.formColumns[columnName] = {
        label: columnName,
        decorator: [
          columnName,
          {
            initialValue: "",
            rules: [
              {
                required: false,
                message: "请输入" + columnName,
                whitespace: true
              }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.d-form {
  height: 100%;
  padding-top: 50px;
}
</style>