<template>
  <div class="much-item-scroll">
    <button @click="onAddDiv(100)">onAddDiv 100</button>
    <button @click="onAddDiv(10000)">onAddDiv 10000</button>
    <button @click="onAddDiv(1000000)">onAddDiv 1000000</button>
    <div ref="box"></div>
  </div>
</template>

<script>
export default {
  name: 'MuchItemScroll',
  created () {
    window.muchItemScroll = this
  },
  mounted () {
    this.onAddDiv()
  },
  methods: {
    onAddDiv(count = 100) {
      const divEl = this.newDivEl(count)
      const boxEl = this.$refs.box
      boxEl.append(divEl)
      const measureHeight = divEl.clientHeight
      boxEl.innerHTML = ''

      this.count = count

      const tempFragment = document.createDocumentFragment()
      const len = count > 200 ? 200 : count
      for (let i = 0; i < len; i++) {
        tempFragment.append(this.newDivEl(i))
      }
      boxEl.append(tempFragment)

      if (count < 200) {
        this.boxIndex = 0
        if (this.scrollHanlder) {
          this.$el.removeEventListener('scroll', this.scrollHanlder)
        }
        boxEl.style.height = 'initial'
      } else {
        this.boxIndex = -1
        // 容器总高度
        boxEl.style.height = measureHeight * 200 + 'px'
        console.log('scroll elements mode')
        if (!this.scrollHanlder) {
          this.scrollHanlder = () => {
            const el = this.$el
            // 当数据量太大时，滚动一个像素，则数据划过不止200条，导致有些数据无法被看到
            const rate = el.scrollTop / (el.scrollHeight - el.clientHeight) * (this.count - 200)
            const index = Math.floor(rate)
            if (this.boxIndex === index) {
              return
            }
            this.boxIndex = index
            const children = [...boxEl.children]
            children.forEach((o, i) => {
              o.innerHTML = i + index
            })
          }
        }
        this.scrollHanlder()
        this.$el.addEventListener('scroll', this.scrollHanlder) 
      }
    },

    newDivEl(index = 0) {
      const el = document.createElement('DIV')
      el.innerHTML = index
      el.style.marginBottom = '10px'
      el.style.backgroundColor = '#eee'
      el.onclick = e => {
        let tempEl = e.target
        let index = -1
        while(tempEl) {
          index++
          tempEl = tempEl.previousElementSibling
        }
        console.log(+e.target.innerHTML, this.boxIndex + index)
        this.$message.info({ message: this.boxIndex + index })
      }
      return el
    }
  }
}
</script>

<style lang="scss" scoped>
.much-item-scroll {
  height: 100%;
  overflow: auto;
}
</style>