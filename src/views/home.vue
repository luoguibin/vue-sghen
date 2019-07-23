<template>
  <el-container class="home">
    <!-- left nav menus -->
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-active="activeIndex" @select="onMenuSelect">
          <template v-for="menu in menus">
            <el-submenu v-if="menu.submenus" :key="menu.key" :index="menu.key">
              <template slot="title">{{menu.name}}</template>
              <el-menu-item
                v-for="submenu in menu.submenus"
                :key="submenu.key"
                :index="menu.key + '-' + submenu.key"
              >{{submenu.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :key="menu.key" :index="menu.key">{{menu.name}}</el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="background-color: white;"></el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      activeIndex: "",
      menus: [
        {
          name: "demo示威",
          key: "demo",
          submenus: []
        },
        {
          name: "书三行",
          key: "peotry"
        },
        {
          name: "game",
          key: "game"
        }
      ]
    };
  },

  created() {
    const object = this.$demoComponentMap,
      submenus = this.menus[0].submenus;
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        submenus.push({
          name: key,
          key: key
        });
      }
    }
  },

  mounted() {
    window.home = this;
    document.body.oncontextmenu = function() {
      return false;
    };
    this.checkRoute();
  },

  watch: {
    $route() {
      this.checkRoute();
    }
  },

  methods: {
    checkRoute() {
      const route = this.$route;
      if (route.matched[1]) {
        this.activeIndex = route.matched[1].name;
        if (this.activeIndex === "demo") {
          this.activeIndex += "-" + route.params.name;
        }
      }
    },

    onMenuSelect(index, indexPath) {
      this.activeIndex = index;
      if (indexPath[0] === "demo") {
        this.$router.push({ path: "/home/" + indexPath[1].replace("-", "/") });
      } else {
        this.$router.push({ name: index });
      }
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
  .el-scrollbar {
    height: 100%;
    background-color: #fff;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
