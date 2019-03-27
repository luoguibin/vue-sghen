import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"

Vue.use(Router)

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/game",
      alias: "/Game",  // 别名，可为数组
      name: "game",
      component: () => import(/* webpackChunkName: "v-game" */ "./views/Game")
    },
    {
      path: "/demo/:name",
      name: "demo",
      component: () => import(/* webpackChunkName: "v-demo" */ "./views/Demo"),
      // props: true,
      props: (route) => ({ compName: route.params.name }),
      // beforeEnter: (to, from, next) => {
      // }
    },
    {
      path: "/*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log("router.beforeEach()");
  next();
});

router.afterEach((to, from) => {
  // console.log("router.afterEach");
});

export default router;
