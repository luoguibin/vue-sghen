<template>
    <div class="scrollbar-table">
        <el-scrollbar>
            <el-table :data="tableData" :stripe="true">
                <el-table-column 
                v-for="column in tableColumns" 
                :key="column.prop" 
                :prop="column.prop"
                :label="column.label"
                width="300">
                </el-table-column>
            </el-table>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
  name: "scrollbar-table",
  data() {
    return {
      tableData: [],
      tableColumns: []
    };
  },
  created() {
    const tableData = this.tableData,
      tableColumns = this.tableColumns;

    for (let i = 0; i < 10; i++) {
      tableColumns.push({
        label: "label" + i,
        prop: "prop" + i
      });
    }

    for (let i = 0; i < 50; i++) {
      const o = {};
      for (let j = 0; j < 10; j++) {
        o["prop" + j] = "value" + i + "" + j;
      }
      tableData.push(o);
    }
  }
};
</script>

<style lang="scss" scoped>
.scrollbar-table {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-scrollbar {
    height: 100%;
  }
}
</style>

<style lang="scss">
.el-table {
  width: initial;
  overflow: initial;

  .el-table__header-wrapper,
  .el-table__body-wrapper {
    overflow: initial;
  }
}
.el-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

