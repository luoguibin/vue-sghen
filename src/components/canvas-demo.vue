<template>
  <div class="canvas-demo">
    <div class="sample">HTML/CSS 1px border</div>
    <img :src="imgURL" class="image" />
    <canvas ref="canvas" @click="resetDraw"></canvas>
  </div>
</template>

<script>
const PIXEL_RATIO = window.devicePixelRatio;

export default {
  data() {
    return {
      imgURL: require("@/assets/image/audio/audio_pause.png"),
    };
  },
  mounted() {
    window.canvasDemo = this;

    const { clientWidth, clientHeight } = this.$el;
    const canvas = this.$refs.canvas;
    canvas.setAttribute("width", clientWidth * PIXEL_RATIO);
    canvas.setAttribute("height", clientHeight * PIXEL_RATIO);

    const ctx = canvas.getContext("2d");
    
    ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
    ctx.translate(0.5, 0.5); // 如果界面强制放大会出现轻微抖动

    ctx.width = clientWidth;
    ctx.height = clientHeight;

    this.ctx = ctx;

    this.img = new Image();
    this.img.src = this.imgURL;

    this.resetDraw();
  },
  methods: {
    /**
     * @param{CanvasRenderingContext2D} ctx
     */
    loopDraw(ctx) {
      if (!ctx) ctx = this.ctx;
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      ctx.save();

      ctx.beginPath();
      ctx.moveTo(10, 40);
      ctx.lineTo(10, 60);
      ctx.lineTo(200, 60);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000";
      ctx.stroke();

      ctx.fillStyle = "#000000";
      ctx.fillText("HTML/CSS 1px border", 12, 50);

      const img = this.img;
      if (img.complete) {
        // ctx.scale(1 / PIXEL_RATIO, 1 / PIXEL_RATIO)
        // 50, 77
        ctx.drawImage(
          img,
          0,
          0,
          img.naturalWidth,
          img.naturalHeight,
          10,
          70,
          img.naturalWidth,
          img.naturalHeight
        );
        console.log(img.naturalWidth, PIXEL_RATIO, img.naturalWidth / PIXEL_RATIO);
        ctx.restore();
        return
      }

      ctx.restore();

      this.handle = requestAnimationFrame(() => this.loopDraw(ctx));
    },
    cancelDraw() {
      cancelAnimationFrame(this.handle);
    },
    resetDraw() {
      this.cancelDraw();
      this.loopDraw();
    },
  },
  beforeDestroy() {
    this.cancelDraw();
  },
};
</script>

<style lang="scss" scoped>
.canvas-demo {
  position: relative;
  height: 100%;
  box-sizing: border-box;

  .sample {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 3px;
    border: 1px solid red;
  }
  .image {
    position: absolute;
    display: inline-block;
    top: 70px;
    left: 70px;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    box-sizing: border-box;
    background-color: #eee;
  }
}
</style>
