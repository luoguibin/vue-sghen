import Vue from "vue"
import App from "./App.vue"

Vue.config.productionTip = false

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI)

import loadComponent from "./views/index";
Vue.prototype.loadComponent = loadComponent;

new Vue({
    created() {
        window.vueInstance2 = this;
    },
    render: h => h(App)
}).$mount("#app")