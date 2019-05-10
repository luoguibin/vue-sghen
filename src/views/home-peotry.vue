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

      <div v-if="showSelf" class="peotry-create">
        <div>
          <span>选集:</span>
          <select v-model="newPeotry.sId">
            <option v-for="set in peotrySets" :key="set.id" :value="set.id">{{set.name}}</option>
          </select>
          <input class="title" placeholder="标题" v-model="newPeotry.title">
        </div>
        <textarea class="content" placeholder="内容，不少于5个字符" v-model="newPeotry.content"></textarea>
        <textarea class="end" placeholder="结尾" v-model="newPeotry.end"></textarea>

        <button @click.stop="onCreate">创建</button>
      </div>
    </div>

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
      return info.iconUrl ? this.baseUrl + info.iconUrl.substr(1) : "./favicon.ico";
    },
    ...mapState({
      userInfo: state => state.user
    })
  },
  methods: {
    handleCommand(e) {
      if (e === "peotry") {
        this.showSelf = !this.showSelf;
        if (this.showSelf) {
          this.getPeotrySets();
        }
      } else if (e === "personal") {
        this.showUserInfo = !this.showUserInfo;
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

      updateUser({ iconUrl: response.data[0], uId: this.userInfo.id })
        .then(resp => {
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
        })
        .catch(e => {
          this.$appTip(e.message);
          this.fileList = [];
        });
    },
    onLogin() {
      loginByAccount(this.account)
        .then(resp => {
          if (resp.data.code === 1000) {
            const info = resp.data.data;
            sessionStorage.setItem("sghen_user_info", JSON.stringify(info));
            this.setUserInfo(info);
            this.showLogin = false;
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
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
      })
        .then(resp => {
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
        })
        .catch(e => {
          this.$appTip(e.message);
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
      })
        .then(resp => {
          if (resp.data.code === 1000) {
            this.$appTip("保存成功");
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
        });
    },
    onDelete(peotry) {
      if (!peotry || !peotry.id) return;

      deletePeotry(peotry.id)
        .then(resp => {
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
        })
        .catch(e => {
          this.$appTip(e.message);
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
      })
        .then(resp => {
          if (resp.data.code === 1000) {
            this.$appTip("评论成功");
            // todo
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
        });
    },

    onCreate() {
      const newPeotry = this.newPeotry;
      if (!newPeotry.title) {
        this.$appTip("请输入标题");
        return;
      }

      if (!newPeotry.content) {
        this.$appTip("请输入内容");
        return;
      } else if (newPeotry.content.length < 5) {
        this.$appTip("内容不能少于5个字符");
        return;
      }

      const data = {
        uId: this.userInfo.id,
        ...newPeotry
      };
      createPeotry(data)
        .then(resp => {
          if (resp.data.code === 1000) {
            this.$appTip("创建成功");
            this.showSelf = false;
            newPeotry.title = "";
            newPeotry.content = "";
            newPeotry.end = "";

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
        })
        .catch(e => {
          this.$appTip(e.message);
        });
    },

    getPeotrySets() {
      queryPeotrySets(this.userInfo.id)
        .then(resp => {
          if (resp.data.code === 1000) {
            const data = resp.data;
            this.peotrySets = data.data;
          } else {
            this.$appTip(resp.data.msg);
          }
        })
        .catch(e => {
          this.$appTip(e.message);
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

.header .peotry-create {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 180, 118);
  z-index: 100;
  border-radius: 5px;
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.5);
}

.peotry-create > textarea {
  max-height: 220px;
  margin: 10px 0;
  border: 2px solid rgb(69, 150, 255);
  border-radius: 5px;
  overflow-y: auto;
  font-size: 16px;
}

.peotry-create .title {
  width: 60%;
  float: right;
  max-height: 30px;
  line-height: 30px;
  padding: 0 3px;
  font-size: 18px;
  box-sizing: border-box;
}

.peotry-create .content {
  width: 100%;
  min-height: 120px;
  max-height: 180px;
  padding: 3px;
  box-sizing: border-box;
  resize: none;
}

.peotry-create .end {
  width: 100%;
  min-height: 30px;
  max-height: 80px;
  padding: 3px;
  box-sizing: border-box;
  resize: none;
}

.peotry-create button {
  padding: 2px 5px;
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
