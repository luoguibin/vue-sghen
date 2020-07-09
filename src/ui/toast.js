import Vue from 'vue'
import Toast from './toast.vue'

let _sgInstance
const toastFunc = function (msg, options = {}) {
  let toast = _sgInstance
  if (!toast) {
    const Func = Vue.component(Toast.name)
    toast = new Func().$mount()
    document.body.append(toast.$el)
    _sgInstance = toast
  }
  toast.show(msg, options)
}

toastFunc.hide = function () {
    _sgInstance && _sgInstance.hide()
}

Vue.prototype.$toast = toastFunc

export default {
  install: function () {
    Vue.component(Toast.name, Toast)
  }
}
