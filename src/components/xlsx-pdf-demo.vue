<template>
  <div class="xlsx-pdf-demo">
    <div>
      <div>
        .xls,.xslx,.xlsx
        <input type="file" accept=".xls, .xslx, .xlsx" @change="onFileChange" />
      </div>

      <button style="margin-left: 10px;" :disabled="!tableData.length" @click="onDownload">下载数据</button>
      <button :disabled="!tableData.length" @click="onDownloadPdf">下载Pdf</button>
    </div>

    <div class="table">
      <div class="header row">
        <div v-for="column in tableColumns" :key="column.prop" class="cell">{{column.prop}}</div>
      </div>
      <div class="content">
        <div class="wrapper">
          <div v-for="(item, index) in tableData" :key="index" class="row">
            <div v-for="column in tableColumns" :key="column.prop" class="cell">{{item[column.prop]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import JsPdf from "jspdf";

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default {
  name: "xlsx-pdf-demo",

  data() {
    return {
      tableColumns: [],
      tableData: []
    };
  },

  created() {
    window.xlsxPdfDemo = this;
  },

  methods: {
    /**
     * @param {Event} e
     */
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        console.log("当前没有选择文件");
        return;
      }

      if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        console.log("文件格式不对", file.name);
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        this.readExcelData(e.target.result);
      };
      reader.readAsBinaryString(file);
    },

    readExcelData(data) {
      if (!data) {
        console.log("读取的数据为空");
        return;
      }

      const workBook = XLSX.read(data, { type: "binary" }),
        sheetName = workBook.SheetNames[0],
        sheet = workBook.Sheets[sheetName];

      const books = XLSX.utils.sheet_to_json(sheet);
      if (!books || !books.length) {
        console.log("解析的数据为空");
        return;
      }

      // 读取字段名
      const book = books[0],
        tableColumns = [];
      Object.keys(book).forEach(key => {
        tableColumns.push({
          prop: key,
          label: key
        });
      });

      // 处理额外数据
      tableColumns.push({ prop: "timeUpload", label: "timeUpload" });
      const time = new Date().getTime();
      books.forEach(book => {
        book.timeUpload = time;
      });

      this.tableColumns = tableColumns;
      this.tableData = books;
    },

    onDownload() {
      const workBook = XLSX.utils.book_new();
      const sheetName = "bookSheet";
      workBook.Sheets[sheetName] = XLSX.utils.json_to_sheet(this.tableData, {
        raw: true
      });
      workBook.SheetNames = [sheetName];

      const data = XLSX.write(workBook, {
        bookType: "xlsx",
        bookSST: false,
        type: "binary"
      });
      saveAs(
        new Blob([s2ab(data)], { type: "application/octet-stream" }),
        "test.xlsx"
      );
    },

    onDownloadPdf() {
      html2canvas(this.$el, {
        allowTaint: true
      }).then(canvas => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new JsPdf("", "pt", "a4");
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save("test.pdf");
      });
    }
  }
};
</script>

<style lang="scss">
.xlsx-pdf-demo {
  height: 100%;
  display: flex;
  flex-direction: column;

  .table {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      font-weight: bold;
    }
    .content {
      flex: 1;
      height: 100%;
    }
    .row {
      display: flex;
      flex-direction: row;
      font-size: 1.4rem;
      line-height: 2.5rem;
    }
    .cell {
      display: inline-block;
      width: 100%;
      padding: 0 1rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .wrapper {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
