<template>
  <div class="cropper-demo">
    <div>
      <span>选择图片</span>
      <input type="file" ref="input" @change="onChange">
      <el-button @click="onStartCrop">crop</el-button>
    </div>
    <div class="container">
      <vue-cropper
        ref="cropper"
        class="cropper"
        :img="option.img"
        :outputType="option.outputType"
        :info="option.info"
        :canMoveBox="option.canMoveBox"
        :fixedBox="option.fixedBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :maxImgSize="option.maxImgSize"
        @realTime="realTime"
        @imgLoad="imgLoad"
        @cropMoving="cropMoving"
      ></vue-cropper>
      <img :src="imgUrl" ref="showImg" style="margin-left: 20px;" :style="imgStyle">
    </div>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import { uploadFiles } from "../../api";

export default {
  name: "cropper-demo",
  components: {
    "vue-cropper": VueCropper
  },
  data() {
    return {
      imgStyle: {},
      imgUrl: "",
      option: {
        img: require("@/assets/img/icon.png"),
        original: true, // 上传图片按照原始比例渲染
        outputType: "png",
        fixedBox: true, // 固定截图框大小 不允许改变
        canMoveBox: false,
        autoCrop: true,
        autoCropWidth: 128, // 只有自动截图开启 宽度高度才生效
        autoCropHeight: 128,
        info: false, // 隐藏裁剪框大小信息
        maxImgSize: 300
      }
    };
  },
  mounted() {
    window.cropperDemo = this;
    if (!this.option.img) {
      this.$refs.input.click();
    }
  },
  methods: {
    onChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader(reader);
      reader.onload = e => {
        this.option.img = reader.result;
      };
      reader.readAsDataURL(file);
    },

    onStartCrop() {
      this.$refs.cropper.getCropBlob(data => {
        const img = this.$refs.showImg;
        img.onload = e => {
          window.URL.revokeObjectURL(this.imgUrl);
          this.imgStyle = {};
          img.onload = null;
        };
        this.imgUrl = window.URL.createObjectURL(data);

        const file = new File([data], "example.png", {
          type: "image/png",
          lastModified: Date.now()
        });
        const formData = new FormData();
        formData.append("file", file);

        uploadFiles({ pathType: "normal" }, formData)
          .then(resp => {
            console.log(resp);
            this.$message(resp.data.msg);
          })
          .catch(err => {
            console.log(err);
          });
      });

      //   this.$refs.cropper.getCropData(data => {
      //     // do something
      //     console.log(data);
      //   });
    },
    realTime(data) {
      //   console.log("realTime", data);
      //   this.imgUrl = data.url;
      //   this.imgStyle = data.img;
    },
    imgLoad(e) {
      console.log("imgLoad", e);
    },
    cropMoving(e) {
      console.log("cropMoving", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.cropper-demo {
  height: 100%;
  overflow: hidden;

  .container {
    text-align: center;

    .cropper {
      display: inline-block;
      width: 300px;
      height: 300px;
    }
  }
}
</style>
