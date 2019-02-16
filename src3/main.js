import Vue from "vue";
import App from "./App";
import getDynamicComponent from "./components/dynamic/index";
require("./components/global/index");

Vue.config.productionTip = false;

window.vDemo = new Vue({
    beforeCreate() { console.log("vue beforeCreate()"); },
    created() { console.log("vue created()"); },
    beforeMount() { console.log("vue beforeMount()"); },
    mounted() { console.log("vue mounted()"); },
    beforeDestroy() { console.log("vue beforeDestroy()"); },
    destroyed() { console.log("vue destroyed()"); },

    // beforeUpdate() {},
    updated() { console.log("vue updated()"); },
    data: { getDynamicComponent },

    render: h => h(App)
}).$mount('#app')