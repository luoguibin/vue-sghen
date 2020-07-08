import Vue from "vue"
import Router from "vue-router"
import Home from "./views/home"

Vue.use(Router)

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/demo/:name",
      name: "demo",
      component: () => import(/* webpackChunkName: "demo" */ "./views/demo"),
      // props: true,
      // props: (route) => ({ compName: route.params.name }),
      // beforeEnter: (to, from, next) => {
      // }
    },
    {
      path: "*",
      redirect: "/home"
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   // console.log("router.beforeEach()");
//   next();
// });

// router.afterEach((to, from) => {
//   // console.log("router.afterEach");
// });

export default router;
