<template>
  <div class="page-list full-height flex-column">
    <div class="header">
      <button @click="onRefresh()">刷新</button>
      <button @click="onToggleSelectAll()">{{isAllSelected ? '全不选' : '全选'}}</button>
      <button :disabled="isAllLoaded" @click="onNextPage()">下一页</button>
      <button :disabled="selectedList.length === 0" @click="onDelete()">删除</button>
    </div>
    <div class="flex-one">
      <div class="list" @click="onClickItem">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="flex-one">
            <div class="text-ellipsis">{{item.id}}</div>
          </div>
          <span item-type="ratio" :class="{'selected': item.isSelected }"></span>
        </div>
        <div v-if="isAllLoaded" class="list-end">共{{total}}条</div>
      </div>
    </div>

    <div v-show="!!tip" class="tip">{{tip}}</div>
  </div>
</template>

<script>
const DATA_CENTER = {
  list: (function () {
    const data = []
    for (let i = 0; i < 36; i++) {
      data.push({
        id: i
      })
    }
    return data
  })(),

  getData (pageNum, pageSize) {
    const endIndex = pageNum * pageSize
    const data = this.list.slice(endIndex - pageSize, endIndex)
    return {
      list: JSON.parse(JSON.stringify(data)),
      total: this.list.length
    }
  },

  remove (id) {
    const index = this.list.findIndex(o => o.id === id)
    index > -1 && this.list.splice(index, 1)
  }
}

export default {
  name: 'PageList',

  data () {
    return {
      list: [],

      pageNum: 1,
      pageSize: 10,
      total: -1,
      isLoading: false,

      tip: ''
    }
  },

  computed: {
    selectedList () {
      return this.list.filter(o => o.isSelected)
    },
    isAllSelected () {
      return this.list.length && this.list.length === this.selectedList.length
    },
    isAllLoaded () {
      return this.total >= 0 && this.list.length === this.total
    }
  },

  created () {
    window.listTest = this
    window.DATA_CENTER = DATA_CENTER
    this.getList()
  },

  methods: {
    onToggleSelectAll () {
      const isAllSelected = this.isAllSelected
      this.list.forEach(o => {
        o.isSelected = !isAllSelected
      })
    },
    onRefresh () {
      this.pageNum = 1
      this.getList()
    },
    onNextPage () {
      if (this.isLoading) {
        return
      }
      this.pageNum += 1
      this.getList(true)
    },
    onDelete () {
      const selectedLength = this.selectedList.length
      this.selectedList.forEach(o => {
        DATA_CENTER.remove(o.id)
        const index = this.list.findIndex(o_ => o_ === o)
        this.list.splice(index, 1)
      })

      // pageNum,pageSize分页，会多加载重复数据
      this.total -= selectedLength
      if (this.total === 0) {
        // 所有都删除完毕
      } else if (this.list.length < this.total) {
        // 尚未删除完，且未加载完数据，应加载新数据，其个数应等于删除的个数
        // 删除数据的虚拟页数，向上取整
        const pageCount = Math.ceil(selectedLength / this.pageSize)
        const newPageNum = this.pageNum - (pageCount - 1)
        // 删除数据末尾一页的个数
        const lastPageCount = selectedLength % this.pageSize
        // console.log(`lastPageCount=${lastPageCount} pageCount=${pageCount}`)
        if (lastPageCount === 0) {
          // 删除数据刚好满页数，看需求是否加载下一页
          if (this.list.length === 0) {
            this.onRefresh()
          }
        } else {
          this.isLoading = true
          // 补充新数据，构成满一页
          this.showTip(`正在加载拼接页数据`)
          this.getListByPage(newPageNum, this.pageSize)
            .then(data => {
              const startIndex = this.pageSize - lastPageCount
              const list = data.list.slice(
                startIndex,
                startIndex + lastPageCount
              )
              list.forEach(o => {
                o.isSelected = this.isAllSelected
              })
              // console.log(`newPageNum=${newPageNum}`, data, startIndex, list)
              if (this.total !== data.total) {
                // 在多端操作情况下，删除后的数据总数不同步
                this.showTip('拼接数据出现异常，请刷新界面')
              } else {
                this.showTip(`加载拼接页数据成功`)
              }
              this.total = data.total
              this.list.push(...list)
              this.pageNum = newPageNum
            })
            .catch(err => {
              console.log(err)
              this.showTip('加载拼接页数据失败，请刷新界面')
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }

      // offset,limit分页，指定数据加载
      // this.offset -= selectedLength
      // this.limit = 10
    },

    getList (isAppend) {
      this.isLoading = true
      this.showTip(`正在加载第${this.pageNum}页数据`)
      this.getListByPage(this.pageNum, this.pageSize).then(data => {
        data.list.forEach(o => {
          o.isSelected = this.isAllSelected
        })
        this.total = data.total
        if (isAppend) {
          this.list.push(...data.list)
        } else {
          this.list = data.list
        }
        this.showTip(`加载成功`)
      }).finally(() => {
        this.isLoading = false
      })
    },
    getListByPage (pageNum, pageSize) {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          const data = DATA_CENTER.getData(pageNum, pageSize)
          resolve(data)
        }, 1000)
      })
    },

    showTip (msg) {
      this.tip = msg
      if (this.tipTimer) {
        clearTimeout(this.tipTimer)
      }
      this.tipTimer = setTimeout(() => {
        this.tip = ''
        this.tipTimer = null
      }, 3000)
    },

    onClickItem (e) {
      const type = e.target.getAttribute('item-type')
      if (!type) {
        return
      }

      const getItemIndex = function (el) {
        let index = -1
        while (el) {
          index++
          el = el.previousElementSibling
        }
        return index
      }

      const el = e.target
      switch (type) {
        case 'ratio':
          {
            const item = this.list[getItemIndex(el.parentElement)]
            item.isSelected = !item.isSelected
          }
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-one {
  flex: 1;
  overflow: hidden;
}
.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.page-list {
  position: relative;
  .header {
    height: 4rem;
    line-height: 4rem;
    text-align: center;
    button {
      padding: 0 1rem;
      line-height: 2.5rem;
      color: white;
      outline: none;
      border: none;
      background-color: rgb(136, 148, 255);
      &:disabled {
        color: rgb(112, 112, 112);
        background-color: rgb(173, 173, 173);
      }
      &:active {
        background-color: rgb(116, 130, 255);
      }
    }
    button + button {
      margin-left: 1rem;
    }
  }
  .list {
    height: 100%;
    overflow-y: auto;
  }
  .tip {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 0.8rem 1rem;
    min-width: 8rem;
    text-align: center;
    color: white;
    background-color: rgba($color: #000000, $alpha: 0.6);
    border-radius: 1rem;
  }

  .list-end {
    text-align: center;
    padding: 2rem 0;
  }
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4rem;
    line-height: 4rem;
    padding: 0 2rem;
    box-sizing: border-box;
    margin-bottom: 1rem;
    background-color: rgb(204, 204, 204);
    span {
      position: relative;
      display: inline-block;
      width: 2rem;
      height: 2rem;
      margin-left: 1rem;
      border-radius: 50%;
      border: 2px solid gray;
      transform: scale(0.8);
      &.selected {
        transform: scale(1);
        border-color: steelblue;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          background-color: steelblue;
        }
      }
    }
  }
}
</style>
