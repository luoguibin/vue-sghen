<template>
  <div class="d-table">
    <a-table
      ref="table"
      bordered
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      :scroll="tableScroll"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="name">{{name.first}}{{name.last}}</template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: "d-table",

  data() {
    return {
      columns: [
        {
          title: "IDIDIDIDIDIDIDIDIDID",
          dataIndex: "id",
          width: "100px"
        },
        {
          title: "Name",
          dataIndex: "name",
          sorter: true,
          width: "200px",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Gender",
          dataIndex: "gender",
          filters: [
            { text: "Male", value: "male" },
            { text: "Female", value: "female" }
          ],
          width: "200px",
        },
        {
          title: "Email",
          dataIndex: "email",
          width: "130px"
        },
        {
          title: "Address",
          dataIndex: "address",
          width: "300px"
        }
      ],
      data: [],
      pagination: { pageSize: 20 },
      loading: false,
      tableScroll: { y: "100%", x: "100%" }
    };
  },

  created() {
    window.dTable = this;
    this.fetch();
  },

  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;

      setTimeout(() => {
        const pagination = { ...this.pagination };
        const data = [];
        const pageSize = params.pageSize || 20;
        let i = params.page ? (params.page - 1) * pageSize : 0;
        const end = i + pageSize;
        for (; i < end; i++) {
          data.push({
            id: i,
            name: {
              first: "firstfirstfirstfirstfirstfirst" + i,
              last: "lastlastlastlastlastlastlast" + i
            },
            gender: i % 2 === 0 ? "male" : "female",
            email: "emailemailemailemailemailemail" + i,
            address: "addressaddressaddressaddressaddressaddress" + i
          });
        }
        pagination.total = 200;
        this.loading = false;
        this.data = data;
        this.pagination = pagination;

        // this.$nextTick(() => {
        //   const el = this.$el;

        //   this.tableScroll.y =
        //     el.getBoundingClientRect().height - 100 - 54 - 64 - 2 + "px";
        // });
      }, Math.random() * 1000 + 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.d-table {
  height: 100%;
  max-height: 100%;
}
</style>

<style lang="scss">
.d-table {
  table {
    table-layout: fixed;

    th > div, td {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .ant-table-wrapper,
  .ant-table,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-content,
  .ant-table-scroll,
  .ant-table-body {
    height: inherit;
    max-height: 100%;
    overflow: hidden !important;
  }

  .ant-spin-container {
    display: flex;
    flex-direction: column;

    .ant-table {
      flex: 1;
      overflow: hidden;
    }

    .ant-table-pagination {
      float: initial;
      text-align: right;
      box-sizing: border-box;
      padding: 16px 0;
      margin: 0;
    }
  }

  .ant-table-scroll {
    display: flex;
    flex-direction: column;

    .ant-table-header {
    }

    .ant-table-body {
      flex: 1;
      overflow: auto !important;
    }
  }
}
</style>