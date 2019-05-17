<template>
  <el-container class="home-peotry">
    <el-header>
      <el-button @click="$router.go(-1)" icon="el-icon-back" circle></el-button>
      <el-button v-if="!userInfo.token" class="float-right" @click="onShowLogin">登录</el-button>

      <el-dropdown v-else class="float-right" @command="handleCommand" trigger="click">
        <span style="cursor: pointer;">
          <span class="el-dropdown-link" style="vertical-align: middle;">{{userInfo.name}}</span>
          <img :src="userInfo.iconUrl" style="width: 33px; vertical-align: middle;">
        </span>
        <el-dropdown-menu>
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="peotry">创建诗词</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog title="登录" :visible.sync="showLogin">
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

      <el-dialog title="个人信息" :visible.sync="showUser">
        <el-form label-width="60px">
          <el-form-item label="ID" v-if="showUserInfo.token">
            <el-input readonly v-model="showUserInfo.id"></el-input>
          </el-form-item>

          <el-form-item label="昵称">
            <el-input readonly v-model="showUserInfo.name"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <img :src="showUserInfo.iconUrl" style="max-width: 50px; vertical-align: top;">
            <el-upload
              v-if="showUserInfo.token"
              class="upload-icon"
              ref="upload"
              :action="baseUrl + '/v1/upload'"
              :data="{'pathType': 'icon', 'token': userInfo.token}"
              :file-list="fileList"
              :auto-upload="true"
              :on-success="onIconUploadSuccess"
            >
              <el-button slot="trigger" size="small" type="primary">选取头像</el-button>
              <!-- <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload"
              >上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="创建诗词" :visible.sync="showCreate">
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
    </el-header>

    <el-main ref="mainEl">
      <!-- <el-carousel trigger="click" type="card" height="230px">
        <el-carousel-item v-for="v in 5" :key="v">
          <div>{{v}}</div>
        </el-carousel-item>
      </el-carousel>-->

      <div class="list" ref="listEl" @click="onClickImage($event)">
        <peotry
          v-for="(peotry, index) in peotries"
          :key="peotry.id"
          :peotry="peotry"
          class="peotry"
          @on-save="onSave"
          @on-delete="onDelete"
          @on-comment="onComment"
          @on-comment-delete="onCommentDelete"
        >
          <template>{{(curPage - 1) * limit + index + 1}}</template>
        </peotry>
      </div>

      <el-dialog title="图片" :visible.sync="showImage" class="show-image" :show-close="false" center>
        <el-image :src="showImageUrl">
          <div slot="error" class="image-error-slot">
            <i class="el-icon-picture-outline"></i>
            <p>图片加载失败</p>
          </div>
        </el-image>
      </el-dialog>
    </el-main>

    <el-footer height="auto">
      <el-pagination
        v-show="peotries.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Peotry from "@/components/peotry/peotry";
import {
  loginByAccount,
  updateUser,
  queryUsers,
  queryPeotries,
  queryPeotrySets,
  createPeotry,
  updatePeotry,
  deletePeotry,
  createComment,
  deleteComment
} from "../api";
import { baseUrl } from "../api/config";

export default {
  name: "HomePeotry",
  components: {
    peotry: Peotry
  },
  data() {
    return {
      baseUrl,
      account: {
        uId: 15625045984,
        pw: "123456"
      },
      fileList: [],
      userMap: {},

      showLogin: false,
      showCreate: false,
      showUser: false,
      showUserInfo: {
        id: 0,
        name: "",
        token: "",
        iconUrl: ""
      },
      showImage: false,
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
  provide() {
    return {
      userMap: this.userMap
    };
  },
  created() {
    window.homePeotry = this;
    const infoStr = sessionStorage.getItem("sghen_user_info");
    if (infoStr) {
      this.setUserInfo(JSON.parse(infoStr));
    }
    this.getPeotries();
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  watch: {
    userInfo: {
      deep: true,
      handler() {
        // 重换登录后评论的fromId需要更新
        this.peotries.forEach(peotry => {
          if (peotry.comment) {
            peotry.comment.fromId = this.userInfo.id;
          }
        });
        // 相应token清空
        const userMap = this.userMap;
        for (const key in userMap) {
          if (userMap.hasOwnProperty(key)) {
            userMap[key].token = "";
          }
        }

        this.userMap[this.userInfo.id] = JSON.parse(
          JSON.stringify(this.userInfo)
        );
      }
    }
  },
  methods: {
    resetUserIconUrl(userInfo) {
      userInfo.iconUrl = userInfo.iconUrl
        ? this.baseUrl + userInfo.iconUrl.substr(1)
        : "./favicon.ico";
    },
    handleCommand(key) {
      switch (key) {
        case "peotry":
          this.showCreate = !this.showCreate;
          if (this.showCreate) {
            this.getPeotrySets();
          }
          break;
        case "personal":
          this.showUser = true;
          this.showUserInfo = this.userMap[this.userInfo.id];
          break;
        case "logout":
          this.setUserInfo();
          break;
        default:
          break;
      }
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.getPeotries();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPeotries();
    },
    onShowLogin() {
      this.showLogin = !this.showLogin;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onIconUploadSuccess(response, file, fileList) {
      if (response.code !== 1000) return;

      updateUser({ iconUrl: response.data[0], uId: this.userInfo.id }).then(
        resp => {
          if (resp.data.code === 1000) {
            this.$appTip("更新头像成功");
            this.setUserInfo({ ...this.userInfo, iconUrl: response.data[0] });
          } else {
            this.$appTip(resp.data.msg);
          }
          this.fileList = [];
        }
      );
    },
    onLogin() {
      loginByAccount(this.account).then(resp => {
        if (resp.data.code === 1000) {
          const info = resp.data.data;
          this.resetUserIconUrl(info);
          this.setUserInfo(info);
          this.showLogin = false;
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },
    updatePeotriesData(datas) {
      const idsSet = new Set();
      datas.forEach(peotry => {
        idsSet.add(peotry.user.id);

        const comments = peotry.comments;
        if (comments && comments.length) {
          comments.forEach(comment => {
            if (comment.fromId > 1) {
              idsSet.add(comment.fromId);
            }
            if (comment.toId > 1) {
              idsSet.add(comment.toId);
            }
          });
        } else {
          peotry.comments = [];
        }
      });

      if (idsSet.size) {
        const ids = Array.from(idsSet);
        queryUsers(ids).then(resp => {
          if (resp.data.code === 1000) {
            const users = resp.data.data;
            const userMap = this.userMap;

            users.forEach(user => {
              if (!userMap[user.id]) {
                this.resetUserIconUrl(user);
                userMap[user.id] = user;
              }
            });
            this.$forceUpdate();
          } else {
            this.$appTip(resp.data.msg);
          }
        });
      }
    },
    getPeotries(bottom) {
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
          this.updatePeotriesData(data.data);
          this.peotries = data.data;

          this.$nextTick(() => {
            const main = this.$refs.mainEl.$el;
            main.scrollTop = bottom ? main.scrollHeight : 0;
          });
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

    onComment(comment, peotryId) {
      if (!this.userInfo.token) {
        this.$appTip("请登录后再操作");
        this.showLogin = true;
        return;
      }
      createComment(comment).then(resp => {
        if (resp.data.code === 1000) {
          comment.id = resp.data.data;
          if (comment.toId > 0) {
            this.$appTip("评论成功");
            this.addComment(peotryId, comment);
            return;
          }
          if (comment.content.indexOf("unpraise") !== -1 && peotryId) {
            this.spliceComment(peotryId, comment.id);
          } else {
            this.addComment(peotryId, comment);
          }
        } else {
          this.$appTip(resp.data.msg);
        }
      });
    },
    addComment(peotryId, comment) {
      const peotry = this.peotries.find(o => o.id === peotryId);
      if (peotry) {
        window.testPeotry = peotry;
        const newComment = JSON.parse(JSON.stringify(comment));
        newComment.createTime = new Date().toJSON();
        peotry.comments.push(newComment);
      }
    },
    spliceComment(peotryId, id) {
      this.peotries.forEach(peotry => {
        if (peotry.id === peotryId && peotry.comments) {
          const index = peotry.comments.findIndex(comment => comment.id === id);
          if (index !== -1) {
            peotry.comments.splice(index, 1);
          }
        }
      });
    },

    onCommentDelete(id, peotryId) {
      deleteComment({ id, fromId: this.userInfo.id }).then(resp => {
        if (resp.data.code === 1000) {
          this.$appTip("删除成功");
          this.spliceComment(peotryId, id);
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
              this.showCreate = false;

              if (this.totalCount % this.limit === 0) {
                this.totalPage++;
              }
              if (this.curPage !== this.totalPage) {
                this.curPage = this.totalPage;
              }
              this.getPeotries(true);
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
        const imgType = el.getAttribute("img-type");
        if (imgType === "picture") {
          this.showImageUrl = this.showImageUrl ? "" : el.getAttribute("src");
        } else if (imgType.indexOf("user-") === 0) {
          const id = parseInt(imgType.replace("user-", "")),
            user = this.userMap[id];
          this.showUser = true;
          this.showUserInfo = user;
        }
      } else {
        this.showImageUrl = "";
      }
      this.showImage = this.showImageUrl ? true : false;
    },
    ...mapActions({
      setUserInfo: "setUser"
    })
  }
};
</script>

<style lang="scss" scoped>
.home-peotry {
  height: 100%;
  overflow: hidden;

  .el-header {
    padding-top: 12px;

    .float-right {
      float: right;
    }
  }

  .el-main {
    .list {
      // overflow-y: auto;
      max-width: 500px;
      margin: 0 auto;

      .peotry {
        position: relative;
        margin-bottom: 30px;
      }

      .image-show {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>

<style lang="scss">
.home-peotry {
  .show-image {
    .el-dialog__body {
      text-align: center !important;
    }
  }

  .user-login {
    text-align: center;
  }

  .upload-icon {
    display: inline-block;
    margin-left: 10px;
  }

  .el-pagination {
    white-space: pre-wrap;
  }

  .image-error-slot {
    .el-icon-picture-outline {
      font-size: 50px;
    }
  }
}
</style>
