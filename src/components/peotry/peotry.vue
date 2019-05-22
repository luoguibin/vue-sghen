<template>
  <div class="peotry">
    <!-- <img :src="'./favicon.ico'" style="width: 23px; position: absolute; left: 0; top: 5px;"/> -->
    <div class="title" @click.stop="onOrder">
      <i v-if="showDelete" @click.stop="onDelete" class="el-icon-delete" style="font"></i>
      <span
        v-if="peotry.set"
        class="tooltip"
        :tooltip="'选集：' + peotry.set.name"
      >{{peotry.set.name + (peotry.title ? "*" + peotry.title : "")}}</span>
      <span v-else>{{peotry.title}}</span>
    </div>
    <div class="peot">{{peotry.user ? peotry.user.name : ""}}--{{peotry.time | time-format}}</div>

    <!-- `white-wrap: pre-wrap` and code's format -->
    <div
      class="content"
      :class="{'content-edit': contentEditable}"
      ref="contentEl"
      @click.stop="onContent"
      :contenteditable="contentEditable"
      v-html="peotry.content"
      :style="{height: contentHeight}"
    ></div>
    <div v-if="contentHeight !== 'auto'" class="content-expand" @click="contentHeight='auto'">
      <p>...</p>
      <span class="content-expand">展开全文</span>
    </div>
    <i v-if="contentEditable" class="save el-icon-finished" @click.stop="onSave(true)"></i>

    <div>{{peotry.end}}</div>

    <div class="images" v-if="peotryImages">
      <!-- <span style="color: gray;">peotry images has been removed.</span> -->
      <img
        v-for="value in peotryImages"
        alt="image error"
        img-type="picture"
        :key="value"
        :src="baseUrl + value.substr(1)"
      >
    </div>
    <div class="comment-menu">
      <span @click.stop="onToggleComment(userInfo.id)">
        评论
        <i class="el-icon-edit-outline"></i>
      </span>
      <span @click.stop="onCommentPraise()" :style="{color: currentPraise ? '#148acf' : 'initial'}">
        赞
        <i :class="[currentPraise ? 'el-icon-star-on' : 'el-icon-star-off']"></i>
      </span>
    </div>
    <div v-if="praiseComments.length" class="praise-users">
      <img
        v-for="comment in praiseComments"
        :key="comment.id"
        :img-type="'user-' + comment.fromId"
        :src="userMap[comment.fromId] ? userMap[comment.fromId].iconUrl : './favicon.ico'"
      >
    </div>
    <div v-if="realComments.length" class="comments">
      <div
        v-for="comment in realComments"
        class="comment"
        :key="comment.id"
        @click.stop="onCommentUser($event)"
      >
        <div class="users">
          <span
            class="user"
            :user-id="comment.fromId"
            :comment-id="comment.id"
          >{{userMap[comment.fromId] ? userMap[comment.fromId].name : comment.fromId}}</span>
          <span
            v-if="comment.toId !== comment.fromId"
            style="padding: 0 5px; font-weight: initial;"
          >回复</span>
          <span
            v-if="comment.toId !== comment.fromId"
            class="user"
            :user-id="comment.toId"
          >{{userMap[comment.toId] ? userMap[comment.toId].name : comment.toId}}:</span>
          <span v-else>:</span>
        </div>
        <p>{{comment.content}}</p>
      </div>
    </div>
    <div v-if="inComment" class="comment-input">
      <h5
        v-if="peotry.comment.toId !== userInfo.id"
        style="text-align: left;"
      >回复：{{userMap[peotry.comment.toId] ? userMap[peotry.comment.toId].name : peotry.comment.toId}}</h5>
      <el-input
        ref="commentEl"
        type="textarea"
        :autosize="{ maxRows: 4}"
        placeholder="请输入内容"
        v-model="peotry.comment.content"
      ></el-input>
      <el-button @click.stop="onComment" size="small" :disabled="!canComment">提交</el-button>
    </div>

    <el-divider></el-divider>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { baseUrl } from "../../api/config";

export default {
  props: {
    peotry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contentEditable: false,
      showDelete: false,
      inComment: false,
      clickTime: 0,
      contentHeight: "auto",
      baseUrl
    };
  },
  inject: ["userMap"],
  created() {
    this.onContentLeave = this.onContentLeave.bind(this);
  },
  mounted() {
    const contentEl = this.$refs.contentEl;
    if (contentEl.clientHeight > 100) {
      this.contentHeight = "100px";
    }
  },
  filters: {
    timeFormat(v) {
      // 2018-04-15T10:10:10+08:00
      return v.replace("T", " ").replace("+08:00", "");
    }
  },
  methods: {
    onContent() {
      if (this.contentEditable) return;

      const time = new Date().getTime();
      if (time - this.clickTime < 300) {
        this.contentEditable = true;

        document.addEventListener("click", this.onContentLeave);
      }
      this.clickTime = time;
    },
    onSave(real) {
      this.contentEditable = false;
      document.removeEventListener("click", this.onContentLeave);

      const el = this.$refs.contentEl;
      if (real) {
        const content = el.innerText;
        this.peotry.content = content;
        this.$emit("on-save", this.peotry);
      } else {
        el.innerHTML = this.peotry.content;
      }
    },
    onContentLeave() {
      if (this.contentEditable) {
        this.$appTip("放弃修改");
        this.onSave(false);
      }
    },
    onOrder() {
      if (this.showDelete) {
        this.showDelete = false;
        return;
      }
      const time = new Date().getTime();
      if (time - this.clickTime < 300) {
        this.showDelete = true;
      }
      this.clickTime = time;
    },
    onDelete() {
      this.$emit("on-delete", this.peotry);
    },
    checkComment(toId) {
      if (!this.peotry.comment) {
        this.$set(this.peotry, "comment", {
          id: 0,
          content: "",
          type: 1,
          typeId: this.peotry.id,
          fromId: this.userInfo.id,
          toId: toId
        });
      }
      this.peotry.comment.fromId = this.userInfo.id;
      this.peotry.comment.toId = toId;
      this.peotry.comment.content = "";
    },
    onToggleComment(toId, open) {
      if (!this.userInfo.token) {
        this.$appTip("请登录后再操作");
        return;
      }
      this.inComment = open ? open : !this.inComment;
      if (this.inComment) {
        this.checkComment(toId);
        this.$nextTick(() => {
          this.$refs.commentEl.focus();
        });
      }
    },
    onCommentUser(e) {
      if (!this.userInfo.token) {
        this.$appTip("请登录后再操作");
        return;
      }
      const userId = e.srcElement.getAttribute("user-id");
      if (userId) {
        const toId = parseInt(userId);
        const commentId = parseInt(e.srcElement.getAttribute("comment-id"));
        if (toId !== this.userInfo.id) {
          this.onToggleComment(toId);
        } else if (commentId) {
          this.$confirm("是否删除该评论？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.inComment = false;
              this.$emit("on-comment-delete", commentId, this.peotry.id);
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    },
    onCommentPraise() {
      if (!this.userInfo.token) {
        this.$appTip("请登录后再操作");
        return;
      }
      this.checkComment(-1);
      const comment = this.peotry.comment;
      comment.id = this.currentPraise ? this.myPraiseComment.id : comment.id;
      comment.content = this.currentPraise ? "unpraise" : "praise";
      this.onComment();
    },
    onComment() {
      this.$emit("on-comment", this.peotry.comment, this.peotry.id);
      this.inComment = false;
    }
  },
  computed: {
    peotryImages() {
      const imageObj = this.peotry.image;
      if (imageObj && imageObj.count) {
        return JSON.parse(imageObj.images);
      } else {
        return undefined;
      }
    },
    myPraiseComment() {
      if (!this.userInfo) return;
      return this.praiseComments.find(
        comment => comment.toId === -1 && comment.fromId === this.userInfo.id
      );
    },
    currentPraise() {
      return this.myPraiseComment && this.myPraiseComment.content === "praise";
    },
    praiseComments() {
      if (!this.peotry.comments) return [];
      return this.peotry.comments
        .filter(comment => comment.toId === -1 && comment.content === "praise")
        .sort(function(o0, o1) {
          const time0 = new Date(o0.createTime).getTime(),
            time1 = new Date(o1.createTime).getTime();
          return time0 < time1 ? -1 : 1;
        });
    },
    realComments() {
      if (!this.peotry.comments) return [];
      return this.peotry.comments.filter(comment => comment.toId > 0);
    },
    canComment() {
      return this.peotry.comment.content.trim().length > 0;
    },
    ...mapState({
      userInfo: state => state.user
    })
  },
  beforeDestroy() {
    this.onContentLeave();
  }
};
</script>

<style scoped lang="scss">
$size-content: 18px;

.peotry {
  position: relative;
  padding-left: 25px;

  .title {
    font-size: 20px;

    i {
      margin-right: 8px;
      cursor: pointer;

      &:hover {
        color: #148acf;
      }
    }
  }

  .peot {
    margin: 5px 0;
  }

  .content {
    display: inline-block;
    font-size: $size-content;
    white-space: pre-wrap;
    overflow: hidden;
  }

  .content-expand {
    margin-top: -10px;
    font-size: $size-content;

    span {
      cursor: pointer;
      color: gray;
      font-size: 10px;
    }
  }

  div[contenteditable="true"] {
    position: relative;
    padding: 10px 50px 10px 10px;
    border: 1px solid salmon;
  }

  .save {
    vertical-align: baseline;
    margin-left: 5px;
    color: #148acf;
    cursor: pointer;
  }

  .images {
    margin-top: 20px;

    img {
      margin: 5px;
      width: 30%;
    }
  }

  .comment-menu {
    margin: 18px 0 5px 0;
    color: #333;
    user-select: none;

    span {
      cursor: pointer;
      &:hover {
        color: #148acf;
      }
    }
  }

  .praise-users {
    line-height: 24px;
    user-select: none;

    img {
      width: 18px;
      height: 18px;
      margin-right: 3px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 3px;
      }
    }
  }

  .comments {
    position: relative;
    margin-top: 15px;
    padding: 5px 5px 5px 20px;
    background-color: #ddd;
    border-radius: 8px;

    &::before {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      left: 8px;
      top: -10px;
      border: solid 10px transparent;
      border-bottom-color: #ddd;
      border-top-width: 0;
    }

    .comment {
      padding: 5px 3px;

      .users {
        float: left;
        font-weight: bold;
        margin-right: 8px;

        .user {
          cursor: pointer;

          &:hover {
            color: #148acf;
          }
        }
      }

      p {
        white-space: pre-line;
      }
    }
  }

  .comment-input {
    text-align: right;
    max-width: 330px;
    margin-top: 5px;

    .el-button {
      margin-top: 5px;
    }
  }
}
</style>
