<template>
  <el-dialog title="创建诗词" :visible.sync="visible">
    <el-form :model="newPeotry" :rules="formRules" ref="ruleForm" label-width="60px">
      <el-form-item label="选集" prop="sId">
        <el-select v-model="newPeotry.sId" placeholder="请选择">
          <el-option v-for="set in peotrySets" :key="set.id" :value="set.id" :label="set.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input placeholder="标题" v-model="newPeotry.title"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10}"
          placeholder="内容，不少于5个字符"
          v-model="newPeotry.content"
        ></el-input>
      </el-form-item>

      <el-form-item label="尾注" prop="end">
        <el-input type="textarea" placeholder="尾注" v-model="newPeotry.end"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.stop="onCreate">创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { queryPeotrySets, createPeotry } from "@/api";

export default {
  props: {
    showCreate: {
      required: true,
      type: Boolean,
      default: false
    },
    peotry: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      newPeotry: {
        sId: 10001,
        title: "",
        content: "",
        end: ""
      },
      peotrySets: [],

      formRules: {
        sId: [{ required: true, message: "请选择选集", trigger: "click" }],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请选输入诗词内容", trigger: "change" },
          {
            min: 5,
            max: 1000,
            message: "长度在 5 到 1000 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    showCreate() {
      this.visible = this.showCreate;
      if (this.showCreate) {
        this.getPeotrySets();
      }
    },
    peotry() {
      if (this.peotry) {
        this.visible = true;
        const peotry = this.peotry;
        this.newPeotry = {
          id: peotry.id,
          uId: peotry.uId,
          sId: peotry.sId,
          title: peotry.title,
          content: peotry.content,
          end: peotry.end
        };
      } else {
        this.newPeotry = {
          sId: 10001,
          title: "",
          content: "",
          end: ""
        };
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  methods: {
    getPeotrySets() {
      queryPeotrySets(this.userInfo.id).then(resp => {
        if (resp.data.code === 1000) {
          const data = resp.data;
          this.peotrySets = data.data;
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    }
  }
};
</script>

<style>
</style>
