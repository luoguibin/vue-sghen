/**
 * @description 检测设备是否支持组件操作
 * @param {Vue} vm 
 * @param {String} device 
 */
export const checkToTip = function (vm, device) {
  if (device === 'wap') {
    if (!("ontouchstart" in document)) {
      vm.$toast('请在移动端测试', { duration: 5000 })
      return true
    }
  } else if (device === 'web') {
    if (("ontouchstart" in document)) {
      vm.$toast('请在桌面端测试', { duration: 5000 })
      return true
    }
  }
}