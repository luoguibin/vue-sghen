<template>
  <div class="peotry">
    <span class="order" @click.stop="onOrder">
      <slot/>
    </span>
    <div class="title">
      <button v-if="showDelete" @click.stop="onDelete">删除</button>
      <span v-if="peotry.set">{{peotry.set.name + (peotry.title ? "*" + peotry.title : "")}}</span>
      <span v-else>{{peotry.title}}</span>
    </div>
    <div class="peot">{{peotry.user.name}}--{{peotry.time | time-format}}</div>

    <!-- `white-wrap: pre-wrap` and code's format -->
    <div
      class="content"
      :class="{'content-edit': contentEditable}"
      ref="contentEl"
      @click.stop="onContent"
      :contenteditable="contentEditable"
      v-html="peotry.content"
    ></div>
    <button v-if="contentEditable" class="save" @click.stop="onSave(true)">保存</button>
    <div>{{peotry.end}}</div>
    <div class="images" v-if="peotryImages">
      <!-- <span style="color: gray;">peotry images has been removed.</span> -->
      <img v-for="value in peotryImages" alt="image error" :key="value" :src="peotryUrl + value">
    </div>
    <div class="comment-menu" v-show="!contentEditable && !showDelete">
      <span>
        赞
        <i class="el-icon-star-off"></i>
      </span>
      <span @click.stop="onToggleComment(1)">
        评论
        <i class="el-icon-edit-outline"></i>
      </span>
    </div>
    <div v-if="peotry.comments" class="comments">
      <div
        v-for="comment in peotry.comments"
        class="comment"
        :key="comment.id"
        @click.stop="onCommentUser($event)"
      >
        <div class="users">
          <span
            class="user"
            :user-id="comment.fromId"
          >{{userMap[comment.fromId] ? userMap[comment.fromId].name : comment.fromId}}</span>
          <span v-if="comment.toId > 1" style="padding: 0 5px;">回复</span>
          <span
            v-if="comment.toId > 1"
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
        v-if="peotry.comment.toId > 1"
        style="text-align: left;"
      >回复：{{userMap[peotry.comment.toId] ? userMap[peotry.comment.toId].name : peotry.comment.toId}}</h5>
      <el-input
        ref="commentEl"
        type="textarea"
        :autosize="{ maxRows: 4}"
        placeholder="请输入内容"
        v-model="peotry.comment.comment"
      ></el-input>
      <el-button @click.stop="onComment" size="small" :disabled="!canComment">提交</el-button>
    </div>

    <el-divider></el-divider>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
      peotryUrl: "http://127.0.0.1/vue-sghen/images/"
    };
  },
  inject: ["userMap"],
  created() {
    this.onContentLeave = this.onContentLeave.bind(this);
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
    onToggleComment(toId, open) {
      this.inComment = open ? open : !this.inComment;
      if (this.inComment) {
        if (!this.peotry.comment) {
          this.$set(this.peotry, "comment", {
            comment: "",
            type: 1,
            typeId: this.peotry.id,
            fromId: this.userInfo.id,
            toId: toId
          });
        }
        this.peotry.comment.toId = toId;
        this.$nextTick(() => {
          this.$refs.commentEl.focus();
        });
      }
    },
    onCommentUser(e) {
      const userId = e.srcElement.getAttribute("user-id");
      if (userId) {
        const toId = parseInt(userId);
        if (toId !== this.userInfo.id) {
          this.onToggleComment(toId, true);
        }
      }
    },
    onComment() {
      this.$emit("on-comment", this.peotry.comment);
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
    canComment() {
      return this.peotry.comment.comment.trim().length > 0;
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
  max-width: 500px;

  .order {
    position: absolute;
    right: calc(100% + 10px);
    top: 5px;
    cursor: pointer;
    user-select: none;
  }

  .title {
    font-size: 20px;
  }

  .peot {
    margin: 5px 0;
  }

  .content {
    display: inline-block;
    font-size: $size-content;
    white-space: pre-wrap;
  }

  div[contenteditable="true"] {
    position: relative;
    padding: 10px 50px 10px 10px;
    border: 1px solid salmon;
  }

  .save {
    vertical-align: bottom;
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
    span {
      cursor: pointer;
      &:hover {
        color: #148acf;
      }
    }
  }

  .comments {
    padding: 5px 5px 5px 20px;

    .comment {
      background-color: #ddd;
      margin-bottom: 8px;
      padding: 5px 3px;
      .users {
        float: left;
        background-color: #eee;
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
    .el-button {
      margin-top: 5px;
    }
  }
}
</style>
