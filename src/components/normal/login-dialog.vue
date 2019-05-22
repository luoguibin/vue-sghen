<template>
  <el-dialog title="登录" :visible.sync="visible">
    <el-form label-width="50px" class="user-login">
      <el-form-item label="账 号">
        <el-input v-model.number="account.uId" type="tel"></el-input>
      </el-form-item>
      <el-form-item label="密 码">
        <el-input v-model="account.pw" show-password></el-input>
      </el-form-item>
      <el-button type="primary" @click.stop="onLogin">登录</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { loginByAccount } from "@/api";
import { resetUserIconUrl } from "@/common/utils/icon-util";

export default {
  name: "login-dialog",
  data() {
    return {
      visible: false,
      account: {
        uId: 15625045984,
        pw: "123456"
      }
    };
  },
  watch: {
    loginCount() {
      this.visible = true;
    }
  },
  computed: {
    ...mapState({
      loginCount: state => state.loginCount
    })
  },
  methods: {
    onLogin() {
      loginByAccount(this.account).then(resp => {
        if (resp.data.code === 1000) {
          const userInfo = resp.data.data;
          resetUserIconUrl(userInfo);
          this.setUserInfo(userInfo);
          this.visible = false;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    ...mapActions({
      setUserInfo: "setUser"
    })
  }
};
</script>

<style>
</style>
