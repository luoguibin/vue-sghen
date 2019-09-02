import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./style/element-ui.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.config.productionTip = false

Vue.prototype.$NProgress = NProgress;

import LoginDialog from "@/components/normal/login-dialog";
Vue.component(LoginDialog.name, LoginDialog);

new Vue({
  router,
  store,
  created() {
    NProgress.configure({ showSpinner: false });
  },
  render: h => h(App)
}).$mount("#app")