<template>
  <div class="common-db">
    <div class="cb-item">
      <div>
        <el-button @click="getTables()">getTables</el-button>
      </div>
      <el-table :data="tablesData" v-loading="tablesLoading" border>
        <el-table-column prop="name" label="表名"></el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <el-button type="text" slot-scope="scope" @click="getTableData(scope.row)">getTableData</el-button>
        </el-table-column>
      </el-table>
    </div>

    <div class="cb-item">
      <el-table :data="tableColumns" v-loading="tableLoading" border>
        <el-table-column prop="name" label="字段名"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
      </el-table>
    </div>

    <div class="cb-item">
      <el-table :data="tableData" v-loading="tableLoading" border>
        <el-table-column
          v-for="item in tableColumns"
          :key="item.name"
          :prop="item.name"
          :label="item.comment || item.name"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "common-db",

  data() {
    return {
      tablesLoading: false,
      tablesData: [],

      tableLoading: false,
      tableColumns: [],
      tableData: []
    };
  },

  created() {
    window.commonDb = this;
    this.getTables();
  },

  methods: {
    getTables() {
      this.tablesLoading = true;
      api.getTables().then(({ data }) => {
        this.tablesData = data.data || [];
        this.tablesLoading = false;
      });
    },

    getTableData(obj) {
      this.tableLoading = true;

      api.getTableData(obj.name, true).then(({ data }) => {
        this.tableData = data.data || [];
        this.tableColumns = data.columns || [];
        this.tableLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.common-db {
  .cb-item {
    min-height: 200px;
    max-height: 600px;
    border: 1px solid gray;
    border-bottom-width: 2px;
    margin-bottom: 10px;
  }
}
</style>