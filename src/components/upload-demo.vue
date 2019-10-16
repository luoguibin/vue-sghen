<template>
  <div>
    <el-upload
      class="upload-icon"
      ref="upload"
      :action="baseUrl + '/v1/upload'"
      :data="{'pathType': 'icon', 'token': userInfo.token}"
      :file-list="fileList"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :http-request="uploadHttpRequest"
      :on-success="onIconUploadSuccess"
      :before-remove="beforeRemove"
      @on-change="onFileChange"
      list-type="picture-card"
      multiple
    >
      <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      fileList: [],
      baseUrl: 'http://localhost'
    };
  },
  created() {
    window.uploadDemo = this;
  },
  methods: {
    onIconUploadSuccess(response, file, fileList) {
      console.log("onIconUploadSuccess", response, file, fileList);
    },

    /**
     * @param {File} file
     */
    beforeUpload(file) {
      console.log("beforeUpload", file);
      if (file.size / 1024 / 1024 > 8) {
        this.$message("文件" + file.name + "大小超过8M");
        return false;
      }
    },
    uploadHttpRequest(file) {
      console.log("uploadHttpRequest", file);
      this.fileData.append("file", file.file);
    },
    submitUpload() {
      console.log("submitUpload");
      this.fileData = new FormData();
      this.$refs.upload.submit();

      console.log("submitUpload after submit");
      // uploadFiles
    },
    beforeRemove(file, fileList) {
      console.log("beforeRemove", file, fileList);
    },
    onFileChange(file, fileList) {
      console.log("onFileChange", file, fileList);
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  }
};
</script>

<style>
</style>
