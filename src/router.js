import Vue from "vue"
import Router from "vue-router"
import Home from "./views/home"

Vue.use(Router)

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "/home/peotry",
      children: [
        {
          path: "peotry",
          name: "peotry",
          component: () => import(/* webpackChunkName: "home-peotry" */ "./views/home-peotry")
        },
        {
          path: "demo/:name",
          name: "demo",
          component: () => import(/* webpackChunkName: "home-demo" */ "./views/home-demo"),
          // props: true,
          props: (route) => ({ compName: route.params.name }),
          // beforeEnter: (to, from, next) => {
          // }
        }
      ]
    },
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
