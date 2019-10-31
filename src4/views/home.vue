<template>
  <a-layout class="home">
    <a-layout-sider>
      <a-menu style="width: 200px" @click="handleClick" v-model="selectedKeys">
        <a-menu-item v-for="menu in menus" :key="menu.key">{{menu.name}}</a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <component v-if="currentComp" :is="currentComp"></component>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Vue from "vue";

const getDemoComponent = function(name) {
  return import(/* webpackChunkName: "[request]" */ "../demo/" + name);
};

export default {
  name: "home",

  data() {
    return {
      menus: [],
      selectedKeys: "",
      compStatus: {},
      currentComp: ""
    };
  },

  watch: {
    $route() {
      this.checkRoute();
    }
  },

  created() {
    window.home = this;
    this.loadMenus().then(() => {
      this.checkRoute();
    });
  },

  methods: {
    checkRoute() {
      const name = this.$route.query.compName;
      if (name) {
        this.loadComp(name);
        this.selectedKeys = [name];
      } else {
        this.$router.push({
          name: "home",
          query: { compName: this.menus[0].name }
        });
      }
    },
    async loadMenus() {
      const requireComponent = require.context("../demo/", false, /\.vue$/);
      this.menus = requireComponent.keys().map(key => {
        const name = key.replace(/^\.\/(.*)\.\w+$/, "$1");
        return { key: name, name: name };
      });
    },

    loadComp(name) {
      if (this.compStatus[name]) {
        this.currentComp = name;
        return;
      }
      getDemoComponent(name)
        .then(o => {
          Vue.component(name, o.default);
          this.compStatus[name] = 1;
          this.currentComp = name;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },

    handleClick(menu) {
      this.loadComp(menu.key);
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>

<style lang="scss">
.home {
  .ant-layout-content {
    overflow: hidden;
  }
}
</style>