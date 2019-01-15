import Vue from "vue";
import AppTip from "./AppTip";

const appTip = {
    constructor: Vue.extend(AppTip),
    instance: null
}


const install = () => {
    Object.defineProperty(Vue.prototype, "$appTip", {
        get() {
            const id = "plugin_app_tip"
            const func = msgHtml => {
                let instance = appTip.instance
                if (!instance) {
                    instance = new appTip.constructor({
                        propsData: {}
                    });
                    instance.id = id;
                    instance.vm = instance.$mount();
                    document.body.appendChild(instance.vm.$el);

                    appTip.instance = instance;
                }
                return instance.vm.show(msgHtml);
            }
            return func;
        }
    })
}
export default install;