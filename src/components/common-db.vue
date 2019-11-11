<template>
  <div class="common-db">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane name="0" label="tables">
        <el-table height="100%" class="cd-auto" :data="tablesData" v-loading="tablesLoading" border>
          <el-table-column prop="name" label="表名"></el-table-column>
          <el-table-column prop="comment" label="描述"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column label="操作">
            <el-button type="text" slot-scope="scope" @click="getTableData(scope.row)">getTableData</el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane class="cd-box" name="1" label="table-column-data">
        <div class="cd-half">
          <el-table height="100%" :data="tableColumns" v-loading="tableLoading" border>
            <el-table-column prop="name" label="字段名"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="comment" label="描述"></el-table-column>
          </el-table>
        </div>

        <el-table height="100%" class="cd-auto" :data="tableData" v-loading="tableLoading" border>
          <el-table-column
            v-for="item in tableColumns"
            :key="item.name"
            :prop="item.name"
            :label="item.comment || item.name"
          ></el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane class="cd-box" name="2" label="sql-data">
        <div class="cd-max">
          <codemirror-demo ref="sqlDemo"></codemirror-demo>
          <div>
            <el-button @click="getSQLData">getSQLData</el-button>
          </div>
        </div>
        <el-table height="100%" class="cd-auto" :data="sqlData" v-loading="sqlLoading" border>
          <el-table-column
            v-for="item in sqlColumns"
            :key="item.name"
            :prop="item.name"
            :label="item.comment || item.name"
          ></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "common-db",

  components: {
    "codemirror-demo": () => import("./codemirror-demo")
  },

  data() {
    return {
      tablesLoading: false,
      tablesData: [],

      tableLoading: false,
      tableColumns: [],
      tableData: [],

      sqlLoading: false,
      sqlColumns: [],
      sqlData: [],

      activeTab: "0"
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
        if (data.code === 1000) {
          this.tablesData = data.data || [];
        } else {
          this.$message.error(data.msg);
        }
        this.tablesLoading = false;
      });
    },

    getTableData(obj) {
      this.tableLoading = true;
      this.activeTab = "1";

      api.getTableData(obj.name, true).then(({ data }) => {
        if (data.code === 1000) {
          this.tableData = data.data || [];
          this.tableColumns = data.columns || [];
        } else {
          this.$message.error(data.msg);
        }
        this.tableLoading = false;
      });
    },

    getSQLData() {
      this.sqlLoading = true;
      const editCode = this.$refs.sqlDemo.editCode;

      api.getSQLData(editCode).then(({ data }) => {
        console.log(data);
        if (data.code === 1000) {
          this.sqlData = data.data || [];
          const columns = [];
          if (this.sqlData.length) {
            const object = data.data[0];
            for (const key in object) {
              if (object.hasOwnProperty(key)) {
                columns.push({ name: key });
              }
            }
          }
          this.sqlColumns = columns;
        } else {
          this.$message.error(data.msg);
        }
        this.sqlLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.common-db {
  height: 100%;
  overflow: hidden;

  .cd-box {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .cd-half {
      max-height: 50%;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .cd-auto {
      flex: 1;
      overflow: hidden;
    }
  }

  /deep/.el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__content {
      flex: 1;
    }
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>