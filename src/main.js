import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./style/element-ui.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

require("promise.prototype.finally").shim()

Vue.config.productionTip = false

Vue.prototype.$NProgress = NProgress;

new Vue({
  router,
  store,
  created() {
    NProgress.configure({ showSpinner: false });
  },
  render: h => h(App)
}).$mount("#app")