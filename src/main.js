import Vue from 'vue'
import App from './App.vue'
import store from './store'

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './style/element-ui.css'
// Vue.use(ElementUI)

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.config.productionTip = false
Vue.prototype.$NProgress = NProgress;

new Vue({
  store,
  created() {
    NProgress.configure({ showSpinner: false });
  },
  render: h => h(App)
}).$mount('#app')

