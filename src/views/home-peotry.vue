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

      <el-dialog title="个人信息" :visible.sync="showUser" @open="onUserInfoDialogOpen">
        <el-form label-width="60px">
          <el-form-item label="ID" v-if="showUserInfo.token">
            <el-input disabled="" v-model="showUserInfo.id"></el-input>
          </el-form-item>

          <el-form-item label="昵称">
            <el-input :disabled="showUserInfo.token ? false : true" v-model="showUserInfo.name"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <img :src="showUserInfo.iconUrl" style="max-width: 50px; vertical-align: top;">
            <span v-if="showUserInfo.token">
              <el-button @click="onClickIconUpdate">更换</el-button>
              <input
                type="file"
                ref="iconInput"
                accept="image/*"
                @change="onIconChange"
                v-show="false"
              >
            </span>
          </el-form-item>

          <el-form-item v-if="showUserInfo.token">
            <el-button type="primary" @click="onUpdateUserInfo">更新信息</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="头像更新" :visible.sync="iconDialogVisible">
        <vue-cropper
          ref="cropper"
          class="cropper"
          :img="option.img"
          :outputType="option.outputType"
          :info="option.info"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :maxImgSize="option.maxImgSize"
        ></vue-cropper>
        <el-button @click="onSubmitCropper">更新</el-button>
      </el-dialog>

      <peotry-create :showCreate="showCreate" :peotry="updatePeotry" @on-close="onPeotryClose"></peotry-create>
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
          @on-delete="onDelete"
          @on-update="onUpdate"
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
import PeotryCreate from "@/components/peotry/peotry-create";
import { VueCropper } from "vue-cropper";
import {
  updateUser,
  queryUsers,
  queryPeotries,
  deletePeotry,
  createComment,
  deleteComment,
  uploadFiles
} from "../api";
import { baseUrl } from "../api/config";
import { resetUserIconUrl } from "@/common/utils/icon-util";

export default {
  name: "HomePeotry",
  components: {
    peotry: Peotry,
    "peotry-create": PeotryCreate,
    "vue-cropper": VueCropper
  },
  data() {
    return {
      baseUrl,
      account: {
        uId: 15625045984,
        pw: "123456"
      },
      userMap: {},

      showCreate: false,
      showUser: false,
      showUserInfo: {
        id: 0,
        name: "",
        iconUrl: "",
        token: ""
      },
      showImage: false,
      showImageUrl: "",
      updatePeotry: null,

      limit: 10,
      curPage: 1,
      totalPage: 1,
      totalCount: 0,
      peotries: [],

      iconDialogVisible: false,
      option: {
        img: "",
        original: true, // 上传图片按照原始比例渲染
        outputType: "png",
        fixedBox: true, // 固定截图框大小 不允许改变
        canMoveBox: false,
        autoCrop: true,
        autoCropWidth: 128, // 只有自动截图开启 宽度高度才生效
        autoCropHeight: 128,
        info: false, // 隐藏裁剪框大小信息
        maxImgSize: 300
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
    this.getPeotries();
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  watch: {
    userInfo: {
      immediate: true,
      handler() {
        const userInfo = this.userInfo;
        if (userInfo.token) {
          // 重换登录后评论的fromId需要更新
          this.peotries.forEach(peotry => {
            if (peotry.comment) {
              peotry.comment.fromId = userInfo.id;
            }
          });

          this.userMap[userInfo.id] = JSON.parse(JSON.stringify(userInfo));

          if (this.showUserInfo.id) {
            this.showUserInfo = this.userMap[this.showUserInfo.id];
          }
        } else {
          // 相应token清空
          const userMap = this.userMap;
          for (const key in userMap) {
            if (userMap.hasOwnProperty(key) && userMap[key].token) {
              userMap[key].token = "";
            }
          }
        }
      }
    }
  },
  methods: {
    handleCommand(key) {
      switch (key) {
        case "peotry":
          this.showCreate = true;
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
      this.showLogin();
    },

    onUserInfoDialogOpen() {
      this.oldShowUserInfo = JSON.parse(JSON.stringify(this.showUserInfo))
    },

    onClickIconUpdate() {
      this.$refs.iconInput.click();
    },
    /**
     * 打开图片选择
     */
    onIconChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader(reader);
      reader.onload = e => {
        this.option.img = reader.result;
        this.iconDialogVisible = true;
      };
      reader.readAsDataURL(file);
    },
    onSubmitCropper() {
      this.$refs.cropper.getCropBlob(data => {
        const file = new File([data], "example.png", {
          type: "image/png",
          lastModified: Date.now()
        });
        const formData = new FormData();
        formData.append("file", file);

        uploadFiles({ pathType: "normal" }, formData)
          .then(resp => {
            if (resp.data.code !== 1000) {
              this.$appTip(resp.data.msg);
              return;
            }

            const iconUrl = resp.data.data[0];
            updateUser({
              iconUrl,
              uId: this.userInfo.id
            }).then(resp => {
              if (resp.data.code === 1000) {
                this.$appTip("更新头像成功");
                const info = { ...this.userInfo, iconUrl: iconUrl };
                resetUserIconUrl(info);
                this.setUserInfo(info);
                this.iconDialogVisible = false;
              } else {
                this.$appTip(resp.data.msg);
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    onUpdateUserInfo() {
      if (this.oldShowUserInfo.name !== this.showUserInfo.name) {
        if (this.showUserInfo.name.length) {
          updateUser({
              name: this.showUserInfo.name,
              uId: this.userInfo.id
            }).then(resp => {
              if (resp.data.code === 1000) {
                this.$appTip("更新个人信息成功");
                const info = { ...this.userInfo, name: this.showUserInfo.name };
                this.setUserInfo(info);
                this.showUser = false;
              } else {
                this.$appTip(resp.data.msg);
              }
            });
        } else {
          this.$message("名字不能为空")
        }
      } else {
        this.$message("个人信息未发生变化")
      }
    },
    updatePeotriesData(datas) {
      const idsSet = new Set();
      datas.forEach(peotry => {
        if (peotry.user && peotry.user.id) {
          idsSet.add(peotry.user.id);
        }

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
                resetUserIconUrl(user);
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
    onUpdate(peotry) {
      if (!peotry || !peotry.id) return;
      this.updatePeotry = peotry;
    },
    onPeotryClose(createValue) {
      this.updatePeotry = null;
      this.showCreate = false;

      if (createValue) {
        if (this.totalCount % this.limit === 0) {
          this.totalPage++;
        }
        if (this.curPage !== this.totalPage) {
          this.curPage = this.totalPage;
        }
      }
      this.getPeotries(createValue);
    },

    onComment(comment, peotryId) {
      if (!this.userInfo.token) {
        this.$appTip("请登录后再操作");
        this.showLogin();
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
      setUserInfo: "setUser",
      showLogin: "showLogin"
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

  .cropper {
    display: inline-block;
    width: 300px;
    height: 300px;
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
    text-align: center;
  }

  .image-error-slot {
    .el-icon-picture-outline {
      font-size: 50px;
    }
  }
}
</style>
