import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from './ui/toast'
import {checkToTip} from './common/device-tip'

Vue.use(Toast)
Vue.prototype.$checkToTip = checkToTip

require("promise.prototype.finally").shim()

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")