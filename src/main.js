import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins/index'

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './style/element-ui.css'
// Vue.use(ElementUI)

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import componentMap from "./components/demo/index";

Vue.config.productionTip = false
Vue.use(plugins)

let date = "2019-01-26";
if (process.env.VUE_APP_SGHEN_MODE === 'prod')
  date = new Date().toUTCString();
console.log(date)

Vue.prototype.$NProgress = NProgress;
Vue.prototype.$demoComponentMap = componentMap;


import LoginDialog from "@/components/normal/login-dialog";
Vue.component(LoginDialog.name, LoginDialog);

new Vue({
  router,
  store,
  created() {
    NProgress.configure({ showSpinner: false });
  },
  render: h => h(App)
}).$mount('#app')

