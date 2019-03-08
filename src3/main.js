import Vue from "vue";
import App from "./App";
import getDynaComp from "./components/dynamic/index";
require("./components/global/index");
require("./common/iview-config");

Vue.config.productionTip = false;
Vue.prototype.getDynaComp = getDynaComp;

window.vDemo = new Vue({
    beforeCreate() { console.log("vue beforeCreate()"); },
    created() { console.log("vue created()"); },
    beforeMount() { console.log("vue beforeMount()"); },
    mounted() { console.log("vue mounted()"); },
    beforeDestroy() { console.log("vue beforeDestroy()"); },
    destroyed() { console.log("vue destroyed()"); },

    // beforeUpdate() {},
    updated() { console.log("vue updated()"); },
    data: {
        createdTime: new Date().getTime()
    },

    render: h => h(App)
}).$mount('#app')