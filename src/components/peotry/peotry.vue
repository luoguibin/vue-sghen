<template>
    <div class="peotry">
        <span class="order">
            <slot/>
        </span>
        <div class="title">
            <span v-if="peotry.set">
                {{peotry.set.name + (peotry.title ? "*" + peotry.title : "")}}
            </span>
            <span v-else>{{peotry.title}}</span>
        </div>
        <div class="peot">{{peotry.user.name}}--{{peotry.time}}</div>

        <!-- `white-wrap: pre-wrap` and code's format -->
        <div class="content" :class="{'content-edit': contentEditable}" ref="contentEl" @click.stop="onContent" :contenteditable="contentEditable" v-html="peotry.content"></div>
        <button v-if="contentEditable" class="save" @click.stop="onSave(true)">保存</button>
        <div>{{peotry.end}}</div>
        <div class="images" v-if="peotry.image && peotry.image.count">
            <span style="color: gray;">peotry images has been removed.</span>
            <!-- <img v-for="value in peotry.image.images" alt="image error" :key="value" :src="peotryUrl + value" /> -->
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
      clickTime: 0
    };
  },
  created() {
    this.onContentLeave = this.onContentLeave.bind(this);
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
        this.$emit('on-save', this.peotry);
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
    beforeDestroy() {
      this.onContentLeave();
    }
  }
};
</script>

<style scoped>
.peotry {
  position: relative;
}

.peotry .order {
  position: absolute;
  right: calc(100% + 10px);
  top: 5px;
}

.peotry .title {
  font-size: 20px;
}

.peotry .peot {
  margin: 5px 0;
}

.peotry .content {
  display: inline-block;
  font-size: 18px;
  white-space: pre-wrap;
}

.peotry div[contenteditable="true"] {
  position: relative;
  padding: 10px 50px 10px 10px;
  border: 1px solid salmon;
}

.peotry .save {
  vertical-align: bottom;
}

.peotry .images {
  margin-top: 20px;
}

.images img {
  margin: 5px;
}
</style>
