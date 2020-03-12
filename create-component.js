const fs = require('fs')

let filePathName = process.argv[2]
if (!filePathName) {
  console.log('please input component name. eg: ./src/components/HelloWord')
  return
}
filePathName = filePathName.replace(/\.vue/g, '')
// 格式化文件及路径，eg:`./src/HelloWorld` `HelloWorld`

const compName = filePathName.split('/').pop()
if (!compName) {
  console.log('name error. eg: ./src/components/HelloWord')
  return
}

const compClassStrs = compName.split('').map(s => {
  if (s.charCodeAt(0) >= 'A'.charCodeAt(0) && s.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
    return '-' + s.toLowerCase()
  } else {
    return s
  }
})
if (compClassStrs[0][0] === '-') {
  compClassStrs[0] = compClassStrs[0][1]
}
const compClassName = compClassStrs.join('')

console.log('compName', compName)
console.log('compClassName', compClassName)

const vueText = `<template>
  <div class="${compClassName}">
  </div>
</template>

<script>
export default {
  name: '${compName}',

  props: {},

  data() {
    return {}
  },

  created() {
    console.log('${compName} created()')
  },

  mounted() {},

  activited() {},
  deactivied() {},

  updated() {},
  
  methods: {},

  filters: {},

  watch: {},

  destroyed() {}
}
</script>

<style lang="scss" scoped>
.${compClassName} {}
</style>`

fs.writeFile(filePathName + '.vue', vueText, function (err) {
  if (err) {
    console.log('create error:', err)
  } else {
    console.log('create success')
  }
})