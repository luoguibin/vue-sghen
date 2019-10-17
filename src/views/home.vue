<template>
  <el-container class="home">
    <!-- left nav menus -->
    <el-aside width="200px" :style="{left: isDrawerShow ? '0px' : '-200px'}">
      <el-scrollbar>
        <el-menu ref="elMenu" :default-active="activeIndex" @select="onMenuSelect">
          <el-menu-item v-for="menu in menus" :key="menu.key" :index="menu.key">{{menu.name}}</el-menu-item>
        </el-menu>
      </el-scrollbar>

      <el-button
        class="home_drawer-btn"
        @click="onClickDrawer"
        type="text"
        :icon="[isDrawerShow ? 'el-icon-s-fold' : 'el-icon-s-unfold']"
      ></el-button>
    </el-aside>

    <el-container>
      <el-header style="background-color: white; line-height: 60px;">
        <home-header></home-header>
      </el-header>
      <el-main style="height: 100%;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from "./home-header";

export default {
  name: "home",

  components: {
    "home-header": HomeHeader // () => import("./home-header")
  },

  data() {
    return {
      activeIndex: "",
      menus: [],

      isDrawerShow: false
    };
  },
  mounted() {
    window.home = this;
    document.body.oncontextmenu = function() {
      return false;
    };
    this.loadDemoComponentNames();
    this.checkRoute();
  },

  watch: {
    $route() {
      this.checkRoute();
    }
  },

  methods: {
    loadDemoComponentNames() {
      import("../assets/config/demo-comps.json")
        .then(o => {
          const object = o.default;
          const menus = [];
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              menus.push({
                name: key,
                key: key
              });
            }
          }
          this.menus = menus;
        })
        .catch(err => {
          console.log(err);
        });
    },

    checkRoute() {
      const route = this.$route;
      if (route.name === "demo") {
        this.activeIndex = route.params.name;
        // this.$nextTick(() => {
        //   this.focusActiveMenu();
        // });
        setTimeout(() => {
          this.focusActiveMenu();
        }, 200);
      }
    },

    focusActiveMenu() {
      const elMenu = this.$refs.elMenu;
      if (!elMenu) {
        return;
      }
      const activeMenus = elMenu.$el.getElementsByClassName("is-active");
      if (!activeMenus || !activeMenus.length) {
        return;
      }
      activeMenus[0].focus();
    },

    onMenuSelect(index) {
      this.activeIndex = index;
      this.$router.push({ name: "demo", params: { name: index } });
    },

    onClickDrawer() {
      this.isDrawerShow = !this.isDrawerShow;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;

  .el-aside {
    .home_drawer-btn {
      display: none;
      position: absolute;
      right: -30px;
      top: 10px;
      font-size: 24px;
    }
  }
}

@media screen and (max-width: 500px) {
  .home {
    position: relative;

    .el-aside {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      overflow: inherit;
      transition-property: left;
      transition-duration: 500ms;

      .home_drawer-btn {
        display: initial;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.home {
  .el-scrollbar {
    height: 100%;
    background-color: #fff;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
