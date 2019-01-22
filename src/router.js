import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"

Vue.use(Router)

export default new Router({
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
      name: "game",
      component: () => import(/* webpackChunkName: "game-entrance" */ "./views/Game")
    },
    {
      path: "/demo",
      name: "name",
      component: () => import(/* webpackChunkName: "demo" */ "./views/Demo")
    },
    {
      path: "/*",
      redirect: "/"
    }
  ]
})
