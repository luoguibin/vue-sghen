import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: -1,
      name: "",
      token: ""
    }
  },
  mutations: {
    setUser(state, user) {
      if (user) {
        state.user.id = user.id
        state.user.name = user.name
        state.user.token = user.token
      } else {
        state.user.id = -1
        state.user.name = ""
        state.user.token = ""
      }
    }
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user)
    }
  },
})
