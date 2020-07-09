import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from './ui/toast'

Vue.use(Toast)

require("promise.prototype.finally").shim()

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")