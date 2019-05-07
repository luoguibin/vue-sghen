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
  </div>
</template>

<script>
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
      clickTime: 0,
      peotryUrl: "http://127.0.0.1/vue-sghen/images/"
    };
  },
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
    }
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
}
</style>
