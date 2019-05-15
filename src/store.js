import Vue from "vue"
import Vuex from "vuex"

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
        state.user.id = 0
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
