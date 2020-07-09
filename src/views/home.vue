<template>
  <div class="demos" @click="onClick">
    <div class="wrapper">
      <div v-for="menu in menus" :key="menu.key" class="item">
        <div class="title ellipsis">{{menu.name}}</div>
        <div class="desciption ellipsis">{{menu.description}}</div>
        <div class="desciption ellipsis">JS: {{(menu.js || []).join(',') || '-'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Demos",

  data() {
    return {
      menus: []
    };
  },
  mounted() {
    window.demos = this;
    this.initDemoNames();
  },

  methods: {
    initDemoNames() {
      import("../assets/config/demo-comps.json")
        .then(o => {
          const object = o.default;
          const menus = [];
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              menus.push({
                name: key,
                key: key,
                ...object[key]
              });
            }
          }
          this.menus = menus;
        })
        .catch(err => {
          alert("初始化Demo列表失败：" + JSON.stringify(err || {}));
        });
    },

    /**
     * @description demo按钮点击冒泡
     * @param {Event} e
     */
    onClick(e) {
      let el = e.target;
      if (!el.classList.contains("item")) {
        el = el.parentElement
        if (!el.classList.contains("item")) {
          return;
        }
      }

      let index = 0;
      while (el.previousElementSibling) {
        el = el.previousElementSibling;
        index++;
      }

      const { name } = this.menus[index];
      this.$router.push({
        name: "demo",
        params: { name }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.demos {
  height: 100%;
  overflow-y: auto;
  .wrapper {
    padding: 1rem 0;
  }
  .item {
    display: inline-block;
    width: 100%;
    padding: 0 1rem;
    margin-bottom: 1.6rem;
    font-size: 1rem;
    line-height: 1.5rem;
    box-sizing: border-box;
    border: 1px solid whitesmoke;
    border-radius: 0.5rem;
    background-color: rgb(125, 159, 211);
    color: white;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title {
    font-weight: bold;
  }
  .desciption {
    color: rgb(221, 221, 221);
  }
}
@media screen and (max-width: 500px) {
  .demos {
    .wrapper {
      padding: 1rem;
    }
  }
}
@media screen and (min-width: 501px) and (max-width: 1000px) {
  .demos {
    .item {
      width: 48%;
      margin-right: 1%;
      margin-left: 1%;
    }
  }
}
@media screen and (min-width: 1001px) {
  .demos {
    .item {
      width: 30%;
      margin-right: 1.5%;
      margin-left: 1.5%;
    }
  }
}
</style>
