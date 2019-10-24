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
      component: Home
    },
  ]
});

export default router;
