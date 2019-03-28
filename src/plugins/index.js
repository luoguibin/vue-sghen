import Vue from "vue";
import AppTip from "./app-tip";

const install = () => {
    let appTip;
    Object.defineProperty(Vue.prototype, "$appTip", {
        get() {
            if (!appTip) {
                appTip = new (Vue.extend(AppTip))({
                    propsData: {}
                });

                appTip.id = "plugin_app_tip";
                appTip.$mount();
                document.body.appendChild(appTip.$el);
            }
            return appTip.show;
        }
    })
}
export default install;