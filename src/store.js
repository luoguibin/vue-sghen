import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        loginCount: 0
    },
    mutations: {
        setUser(state, user) {
            if (user) {
                sessionStorage.setItem("sghen_user_info", JSON.stringify(user));
                state.user = user;
            } else {
                sessionStorage.removeItem("sghen_user_info");
                state.user = null
            }
        },
        showLogin(state) {
            state.loginCount++;
        }
    },
    actions: {
        setUser(context, user) {
            context.commit("setUser", user)
        },
        showLogin(context) {
            context.commit("showLogin")
        }
    },
})
