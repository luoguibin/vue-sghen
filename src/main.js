import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.use(plugins)

let date = "2019-01-26";
if (process.env.VUE_APP_SGHEN_MODE === 'prod')
  date = new Date().toUTCString();
console.log(date)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

