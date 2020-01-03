<template>
  <div class="word-tree">
    <div class="word-tree_header">
      <el-button @click="onOpenNewWord">新增单词</el-button>
    </div>

    <el-tree
      ref="tree"
      :data="treeData"
      node-key="id"
      accordion
      @node-expand="handleNodeExpand"
      @current-change="handleCurrentChange"
    ></el-tree>

    <el-dialog title="新增单词" :visible.sync="newWordVisible">
      <el-input v-model="newWord"></el-input>
      <el-button slot="footer" @click="onNewWord">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Pinyin from "pinyin";

export default {
  name: "WordTree",

  data() {
    return {
      newWordVisible: false,
      newWord: "",
      currentNodeData: null,
      treeData: [
        {
          id: "root",
          label: "root",
          children: [{ id: "child_0", label: "节点1", children: [] }]
        }
      ]
    };
  },

  created() {
    window.wordTree = this;
    // window.Pinyin = Pinyin
  },

  methods: {
    onOpenNewWord() {
      if (this.currentNodeData) {
        this.newWordVisible = true;
        this.newWord = "";
      }
    },
    onNewWord() {
      const label = this.newWord;
      if (!label) {
        return;
      }
      
      const pinyin = Pinyin(label, { style: Pinyin.STYLE_NORMAL });
      const id = pinyin.join("");
      const list = this.currentNodeData.children;
      const isRepeatId = list.find(o => o.id === id);
      if (!isRepeatId) {
        list.push({ id, label, children: [] });
        this.newWordVisible = false;
      } else {
        this.$message.warning("id重复")
      }
    },

    handleNodeExpand(data, o, view) {
      // console.log(data, o, view)
    },
    handleCurrentChange(data, node, flag) {
      this.currentNodeData = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.word-tree {
  position: relative;
  height: 100%;

  .word-tree-header {
    position: absolute;
  }
}
</style>

<style lang="scss">
.word-tree {
  .el-tree {
    .el-tree-node__content {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>