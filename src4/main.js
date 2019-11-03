import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import antd from "ant-design-vue";
// import 'ant-design-vue/dist/antd.css';
Vue.use(antd)

Vue.config.productionTip = false


new Vue({
  router,
  created() { },
  render: h => h(App)
}).$mount("#app")