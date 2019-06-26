<template>
  <div class="hello0">
    <el-button
      v-for="optionBtn in optionBtns"
      :key="optionBtn.key"
      @click="onOption(optionBtn)"
    >{{optionBtn.name}}</el-button>
  </div>
</template>

<script>
export default {
  name: "hello0",
  data() {
    return {
      typeData: {}
    };
  },
  created() {
    window.hello0 = this;
    this.loadDataType("admin");
  },
  computed: {
    optionBtns() {
      return this.typeData.options ? this.typeData.options : [];
    }
  },
  methods: {
    loadDataType(type) {
      import("./data/" + type)
        .then(o => {
          this.typeData = o.default;
        })
        .catch(error => {
          this.$message("加载数据失败");
          console.log(error);
        });
    },

    onOption(optionBtn) {
      console.log(optionBtn.key);
      switch (optionBtn.key) {
        case "add":
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hello0 {
}
</style>
