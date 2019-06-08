<template>
  <div class="scrollbar-tree">
    <div ref="header" style="height: 120px; text-align: center; color: #2c3e50;">
      <div>{{tokenLog}}</div>
    </div>

    <div ref="container" style="position: relative;" :style="{height: mainHeight}">
      <div :style="scrollbarStyle">
        <el-scrollbar ref="scrollbar" :style="{height:this.scrollHeight + 'px'}">
          <el-tree
            ref="tree"
            :data="treeData"
            class="tree"
            node-key="id"
            accordion
            :default-expanded-keys="expandedKeys"
            :default-checked-keys="checkedKeys"
            :render-content="renderContent"
            @current-change="handleCurrentChange"
            @node-expand="handleNodeExpand"
          ></el-tree>
        </el-scrollbar>
      </div>
      <div
        :style="{height: mainHeight}"
        style="background-color: #999; position: absolute; top: 0; left: 200px; right: 0;"
      >
        <div style="text-align: center">
          <span>高度</span>
          <input readonly v-model="mainHeight">
        </div>
      </div>
    </div>

    <footer
      ref="footer"
      style="text-align: center; height: 150px; line-height: 150px; background-color: #aaa;"
    >this is footer</footer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      treeData: [],
      expandedKeys: [],
      checkedKeys: [],
      tokenLog: "",
      mainHeight: "100px",

      scrollHeight: 100,
      scrollbarPosition: "initial",
      scrollbarTop: "0px"
    };
  },
  created() {
    const treeData = this.treeData;
    for (let i = 0; i < 10; i++) {
      const children = [];

      if (i < 8) {
        for (let j = 0; j < 8; j++) {
          const children_j = [];
          if (j < 4) {
            for (let k = 0; k < 5 * (j + 1); k++) {
              children_j.push({
                id: i + "-" + j + "-" + k,
                label: "label" + i + "-" + j + "-" + k,
                contentHeight: Math.round(Math.random() * 10000)
              });
            }
          }
          const data = {
            id: i + "-" + j,
            label: "label" + i + "-" + j,
            contentHeight: Math.round(Math.random() * 10000),
            children: children_j
          };
          children.push(data);
        }
      }

      const data = {
        id: i + "",
        label: "label" + i,
        contentHeight: Math.round(Math.random() * 10000),
        children
      };
      treeData.push(data);
    }

    this.checkToken();

    if (!this.$root.token) {
      this.tokenLog += "token is null ";
      setTimeout(() => {
        const token = new Date().toString();
        localStorage.setItem("mtoken", token);
        this.checkToken();
      }, 3000);
    } else {
      this.tokenLog += "token is " + this.$root.token;
    }
  },
  mounted() {
    window.scrollBarTree = this;
    this.setCurrentItem("0-3-18");

    this.onScroll = this.onScroll.bind(this);
    this.$el.addEventListener("scroll", this.onScroll);
    this.onScroll();
  },
  methods: {
    setCurrentItem(nodeId) {
      this.expandedKeys = [nodeId];
      this.checkedKeys = [nodeId];

      const tree = this.$refs.tree;
      tree.setCurrentKey(nodeId);
      this.$nextTick(() => {
        this.handleCurrentChange(
          tree.getCurrentNode(),
          tree.getNode(nodeId),
          true
        );
      });
    },
    checkToken() {
      this.tokenLog += "checkToken ";
      const token = localStorage.getItem("mtoken");
      this.$root.token = token;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="render-content">
          <span>
            <span>{node.id}</span> :: <span>{node.label}</span>
          </span>
        </div>
      );
    },
    handleCurrentChange(o0, o1, flag) {
      this.mainHeight = o0.contentHeight + "px";
      this.$el.scrollTop = 0;

      if (flag) {
        setTimeout(() => {
          const tree = this.$refs.tree;
          const currentEl = tree.$el.getElementsByClassName("is-current")[0];
          if (currentEl) {
            currentEl.blur();
            currentEl.focus();

            // const scrollbar = this.$refs.scrollbar;
            // scrollbar.wrap.scrollTop = currentEl.offsetTop - 10;
            // console.log(scrollbar.wrap.scrollTop, currentEl.offsetTop);
          }
          // 因选中某个选项时，树形图展开动画需要时间，故需要等待动画结束
        }, 800);
      }
    },
    handleNodeExpand(data, o, view) {},
    onScroll(e) {
      const el = this.$el,
        clientHeight = el.clientHeight;
      const refs = this.$refs,
        header = refs.header,
        footer = refs.footer;

      const scrollbarPosition = this.scrollbarPosition;

      // ①滚动条在最顶，或展开tree某个节点，tree布局表现为默认
      if (el.scrollTop < header.clientHeight - 20) {
        this.scrollbarPosition = "initial";
        this.scrollHeight =
          clientHeight - (header.clientHeight - el.scrollTop) - 20;
      } else {
        // ②隐藏header，tree布局表现为fixed
        this.scrollbarPosition = "fixed";
        this.scrollbarTop = 20;
        this.scrollHeight = el.clientHeight - 40;

        // ③footer展现，tree布局表现为默认
        const y = el.clientHeight + el.scrollTop - footer.offsetTop;
        if (y > 0) {
          this.scrollbarTop = -y + 20;
        }
      }

      // 更新滚动
      if (scrollbarPosition !== this.scrollbarPosition) {
        this.$nextTick(() => {
          this.$refs.scrollbar.update();
        });
      }
    }
  },
  computed: {
    scrollbarStyle() {
      return {
        width: "200px",
        height: this.scrollHeight + "px",
        position: this.scrollbarPosition,
        top: this.scrollbarTop + "px",
        bottom: "0px"
      };
    }
  },
  destroyed() {
    console.log("app destroyed");
    localStorage.removeItem("mtoken");
    this.$el.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style lang="scss" scoped>
.scrollbar-tree {
  height: 100%;
  min-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ccc;
}
</style>


<style lang="scss">
.scrollbar-tree {
  .el-scrollbar__wrap {
    overflow-x: hidden;

    .el-scrollbar__view {
      margin-right: 10px;
    }
  }

  .el-tree-node__content {
    position: relative;
  }

  .is-current > div:first-child .render-content {
    width: 100%;
    text-align: left;
    background-color: #ccc;
  }

  .is-current > div:first-child:after {
    content: "";
    display: inline-block;
    width: 4px;
    height: 100%;
    background: #00558e;
    position: absolute;
    right: 0px;
  }
}
</style>
