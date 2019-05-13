<template>
  <div class="home-peotry">
    <div class="header">
      <button @click="$router.go(-1)">返回</button>
      <button v-if="!userInfo.token" class="user" @click="onShowLogin">登录</button>

      <el-dropdown v-else class="user" @command="handleCommand">
        <span>
          <span class="el-dropdown-link" style="vertical-align: middle;">{{userInfo.name}}</span>
          <img :src="myIconUrl" style="width: 33px; vertical-align: middle;">
        </span>
        <el-dropdown-menu>
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="peotry">创建诗词</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog title="个人信息" :visible.sync="showUserInfo">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:8088/v1/upload"
          :data="{'pathType': 'icon', 'token': userInfo.token}"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="onIconUploadSuccess"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-dialog>

      <div v-if="showLogin" class="user-login">
        <input v-model.number="account.uId" type="tel">
        <input v-model="account.pw" type="password">
        <button @click.stop="onLogin">login</button>
      </div>

      <el-dialog title="创建诗词" :visible.sync="showSelf">
        <el-form :model="newPeotry" :rules="formRules" ref="ruleForm" label-width="60px">
          <el-form-item label="选集" prop="sId">
            <el-select v-model="newPeotry.sId" placeholder="请选择">
              <el-option v-for="set in peotrySets" :key="set.id" :value="set.id" :label="set.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input placeholder="标题" v-model="newPeotry.title"></el-input>
          </el-form-item>

          <el-form-item label="标题" prop="content">
            <el-input type="textarea" placeholder="内容，不少于5个字符" v-model="newPeotry.content"></el-input>
          </el-form-item>

          <el-form-item label="标题" prop="end">
            <el-input type="textarea" placeholder="结尾" v-model="newPeotry.end"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click.stop="onCreate">创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <el-carousel trigger="click" type="card" height="200px">
      <el-carousel-item v-for="v in 5" :key="v">
        <div>{{v}}</div>
      </el-carousel-item>
    </el-carousel>

    <div class="list" ref="listEl" @click="onClickImage($event)">
      <peotry
        v-for="(peotry, index) in peotries"
        :key="peotry.id"
        :peotry="peotry"
        class="peotry"
        @on-save="onSave"
        @on-delete="onDelete"
        @on-comment="onComment"
      >
        <template>{{(curPage - 1) * limit + index + 1}}</template>
      </peotry>
    </div>

    <div class="image-show" v-show="showImageUrl" @click.stop="onClickImage($event)">
      <img :src="showImageUrl">
    </div>

    <div class="footer" v-show="peotries.length">
      <button @click.stop="onPage(-1)">←</button>
      <button @click.stop="onPage(1)">→</button>
      <span>
        当前第
        <input class="current-page" v-model.number="curPage">
        页，每页{{limit}}条，共{{totalPage}}页，一共{{totalCount}}条
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Peotry from "@/components/peotry/peotry";
import {
  loginByAccount,
  updateUser,
  queryPeotries,
  queryPeotrySets,
  createPeotry,
  updatePeotry,
  deletePeotry,
  createComment
} from "../api";
import { baseUrl } from "../api/config";

export default {
  name: "HomePeotry",
  components: {
    peotry: Peotry
  },
  data() {
    return {
      baseUrl: baseUrl,
      showLogin: false,
      showSelf: false,
      showUserInfo: false,
      fileList: [],
      account: {
        uId: 15625045984,
        pw: "123456"
      },

      peotryUrl: "",
      showImageUrl: "",
      limit: 10,
      curPage: 1,
      totalPage: 1,
      totalCount: 0,
      peotries: [],

      peotrySets: [],
      newPeotry: {
        sId: 10001,
        title: "",
        content: "",
        end: ""
      },
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
  created() {
    window.homePeotry = this;
    const infoStr = sessionStorage.getItem("sghen_user_info");
    if (infoStr) {
      const info = JSON.parse(infoStr);
      if (info.id === this.userInfo.id) {
        this.getPeotries();
      } else {
        this.setUserInfo(info);
      }
    }
  },
  watch: {
    userInfo: {
      deep: true,
      handler() {
        this.getPeotries();
      }
    },
    curPage(newVal, oldVal) {
      if (newVal < 1 || newVal > this.totalPage) {
        this.curPage = oldVal;
        return;
      }
      if (!oldVal) return;
      this.getPeotries();
    }
  },
  computed: {
    myIconUrl() {
      const info = this.userInfo;
      return info.iconUrl
        ? this.baseUrl + info.iconUrl.substr(1)
        : "./favicon.ico";
    },
    ...mapState({
      userInfo: state => state.user
    })
  },
  methods: {
    handleCommand(key) {
      switch (key) {
        case "peotry":
          this.showSelf = !this.showSelf;
          if (this.showSelf) {
            this.getPeotrySets();
          }
          break;
        case "personal":
          this.showUserInfo = !this.showUserInfo;
          break;
        case "logout":
          sessionStorage.removeItem("sghen_user_info");
          setTimeout(() => {
            this.$router.go(0);
          }, 200);
          break;
        default:
          break;
      }
    },
    onShowLogin() {
      this.showLogin = !this.showLogin;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onIconUploadSuccess(response, file, fileList) {
      if (response.code !== 1000) return;

      updateUser({ iconUrl: response.data[0] }).then(resp => {
        if (resp.data.code === 1000) {
          this.$appTip("更新头像成功");

          const info = this.userInfo;
          info.iconUrl = response.data[0];
          sessionStorage.setItem("sghen_user_info", JSON.stringify(info));
          this.setUserInfo(info);

          this.showUserInfo = false;
        } else {
          this.$appTip(resp.data.msg);
        }
        this.fileList = [];
      });
    },
    onLogin() {
      loginByAccount(this.account).then(resp => {
        if (resp.data.code === 1000) {
          const info = resp.data.data;
          sessionStorage.setItem("sghen_user_info", JSON.stringify(info));
          this.setUserInfo(info);
          this.showLogin = false;
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },
    onPage(value) {
      this.curPage += value;
    },
    getPeotries() {
      queryPeotries({
        limit: this.limit,
        page: this.curPage,
        needComment: true
      }).then(resp => {
        if (resp.data.code === 1000) {
          const data = resp.data;
          this.curPage = data.curPage;
          this.totalPage = data.totalPage;
          this.totalCount = data.totalCount;
          this.peotries = data.data;

          this.$refs.listEl.scrollTop = 0;
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },
    onSave(peotry) {
      if (!peotry || !peotry.id) return;

      updatePeotry({
        pId: peotry.id,
        uId: this.userInfo.id,
        sId: peotry.set.id,
        title: peotry.title,
        content: peotry.content,
        end: peotry.end
      }).then(resp => {
        if (resp.data.code === 1000) {
          this.$appTip("保存成功");
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },
    onDelete(peotry) {
      if (!peotry || !peotry.id) return;

      deletePeotry(peotry.id).then(resp => {
        if (resp.data.code === 1000) {
          this.$appTip("删除成功");
          if (this.peotries.length == 1) {
            this.curPage--;
          } else {
            this.getPeotries();
          }
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },

    onComment(peotry) {
      if (!peotry || !peotry.id) return;
      createComment({
        type: 1,
        typeId: peotry.id,
        fromId: this.userInfo.id,
        toId: 1,
        comment: peotry.comment
      }).then(resp => {
        if (resp.data.code === 1000) {
          this.$appTip("评论成功");
          // todo
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },

    onCreate() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const newPeotry = this.newPeotry;
          const data = {
            uId: this.userInfo.id,
            ...newPeotry
          };
          createPeotry(data).then(resp => {
            if (resp.data.code === 1000) {
              this.$appTip("创建成功");
              this.$refs.ruleForm.resetFields();
              this.showSelf = false;

              if (this.totalCount % this.limit === 0) {
                this.totalPage++;
              }
              if (this.curPage !== this.totalPage) {
                this.curPage = this.totalPage;
              } else {
                this.getPeotries();
              }
            } else {
              this.$appTip(resp.data.msg);
            }
          });
        } else {
          this.$appTip("请输入表单内容");
        }
      });
    },

    getPeotrySets() {
      queryPeotrySets(this.userInfo.id).then(resp => {
        if (resp.data.code === 1000) {
          const data = resp.data;
          this.peotrySets = data.data;
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },

    onClickImage(e) {
      const el = e.srcElement;
      if (el.tagName === "IMG") {
        this.showImageUrl = this.showImageUrl ? "" : el.getAttribute("src");
      } else {
        this.showImageUrl = "";
      }
    },

    ...mapActions({
      setUserInfo: "setUser"
    })
  }
};
</script>

<style scoped>
.home-peotry {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-peotry .header {
  padding: 5px 0;
  box-shadow: 0 3px 10px 6px rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.5);
}

.header .user {
  float: right;
  margin-right: 30px;
  cursor: pointer;
}

.header .user-login {
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 180, 118);
  z-index: 100;
}
.user-login input {
  display: block;
  width: 100%;
  padding: 0.3rem;
  font-size: 18px;
  box-sizing: border-box;
}

.user-login button {
  margin: 0.3rem auto 0;
}

.home-peotry .list {
  flex: 1;
  overflow-y: auto;
  padding-left: 40%;
}

.list .peotry {
  position: relative;
  margin-bottom: 30px;
}

.home-peotry .footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  box-shadow: 0 -3px 10px 6px rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.5);
}

.home-peotry .image-show {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.image-show img {
  max-width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.footer .current-page {
  max-width: 30px;
  text-align: center;
}
</style>
