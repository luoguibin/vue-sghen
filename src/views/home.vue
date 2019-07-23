<template>
  <div class="home">
    <ul>
      <li v-for="menu in menus" :key="menu.key">
        <a :href="menu.path">{{menu.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menus: [
        {
          name: "书三行",
          key: "line3",
          path: "./#/peotry"
        },
        {
          name: "game",
          key: "game",
          path: "./#/game"
        },
        {
          name: "demo示威",
          key: "demo",
          path: "./#/demo/list"
        },
        {
          name: "容器",
          key: "container",
          path: "./#/home-container"
        }
      ]
    };
  },
  created() {
    this.addDynamicRoutes();
  },
  mounted() {
    window.home = this;
    document.body.oncontextmenu = function() {
      return false;
    };
  },
  methods: {
    addDynamicRoutes() {
      const routerConfigs = [
        {
          name: "hello0",
          path: "hello0",
          meta: { isAuth: true }
        },
        {
          name: "hello1",
          path: "hello1"
        },
        {
          name: "hello2",
          path: "hello2"
        }
      ];
      const newRoutes = [];
      routerConfigs.forEach(config => {
        newRoutes.push({
          name: config.name,
          path: config.path,
          component: () =>
            import("@/components/container/" + config.path + ".vue").catch(
              err => import("@/views/home-error")
            ),
          meta: config.meta
        });
      });

      const router = this.$router;
      if (router.newRoutes) {
        return;
      }
      router.newRoutes = newRoutes;
      router.addRoutes([
        {
          path: "/home-container",
          name: "home-container",
          component: () =>
            import(/* webpackChunkName: "home-container" */ "./home-container"),
          children: newRoutes
        },
        {
          path: "/*",
          redirect: "/"
        }
      ]);
      console.log("addDynamicRoutes");
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;

  ul {
    display: inline-block;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    list-style: none;
    font-size: 22px;

    li {
      margin: 10px 0;
    }
  }
}
</style>
