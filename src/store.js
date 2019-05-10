import Vue from "vue"
import Vuex from "vuex"
import { stat } from "fs";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: -1,
      name: "",
      token: "",
      iconUrl: ""
    }
  },
  mutations: {
    setUser(state, user) {
      if (user) {
        state.user.id = user.id
        state.user.name = user.name
        state.user.token = user.token
        state.user.iconUrl = user.iconUrl
      } else {
        state.user.id = -1
        state.user.name = ""
        state.user.token = ""
        state.user.iconUrl = ""
      }
    }
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user)
    }
  },
})
