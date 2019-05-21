<template>
  <div class="canvas-demo">
    <canvas ref="canvas" width="400" height="300" @click="resetDraw" @mousemove="onCanvasMouseMove"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { x: 50, y: 250, near: -1 },
        { x: 100, y: 100, near: -1 },
        { x: 150, y: 200, near: -1 },
        { x: 200, y: 220, near: -1 },
        { x: 250, y: 250, near: -1 },
        { x: 300, y: 140, near: -1 },
        { x: 350, y: 200, near: -1 }
      ]
    };
  },
  mounted() {
    window.canvasDemo = this;

    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext("2d");
    ctx.width = canvas.clientWidth;
    ctx.height = canvas.clientHeight;
    this.ctx = ctx;
    this.drawCount = 0;

    this.data.forEach(o => {
      o.text = o.x + "-" + o.y;
      o.measureTextWidth = ctx.measureText(o.text).width;
    });
    ctx.setLineDash([1000, 1000]);
    this.resetDraw();
  },
  methods: {
    /**
     * @param{CanvasRenderingContext2D} ctx
     */
    loopDraw(ctx) {
      if (!ctx) ctx = this.ctx;
      ctx.clearRect(0, 0, ctx.width, ctx.height);

      ctx.moveTo(0, ctx.height);
      ctx.beginPath();
      this.data.forEach(o => {
        ctx.lineTo(o.x, o.y);
      });

      ctx.lineDashOffset = this.lineDashOffset;
      ctx.stroke();

      this.data.forEach(o => {
        if (o.near > -1) {
          if (o.near > 2) {
            o.near--;
          }
          ctx.beginPath();
          ctx.arc(o.x, o.y, 2 * (6 - o.near), 0, Math.PI * 2, false);
          ctx.stroke();

          ctx.fillText(o.text, o.x - o.measureTextWidth / 2, o.y - 10);
        }
      });

      // 绘制线条动画过程
      if (this.lineDashOffset > 0) {
        this.lineDashOffset -= 5;
      }
      if (this.drawCount) {
        this.drawCount--;
        this.handle = requestAnimationFrame(() => this.loopDraw(ctx));
      }
    },
    cancelDraw() {
      cancelAnimationFrame(this.handle);
    },
    resetDraw() {
      this.cancelDraw();
      this.lineDashOffset = 1000;
      this.drawCount = this.lineDashOffset / 5;
      this.loopDraw();
    },

    onCanvasMouseMove(e) {
      const canvas = e.target,
        rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      const isInDraw = this.drawCount > 0;
      this.data.forEach(o => {
        if (Math.abs(o.x - x) < 15) {
          if (o.near === -1) {
            o.near = 5;
            // 判断当前是否有足够循环绘制去满足当前显示绘制
            if (this.drawCount < 5) {
              this.drawCount += 5;
            }
          }
        } else {
          o.near = -1;
        }
      });

      // 检测是否重新开始循环绘制
      if (!isInDraw && this.drawCount) {
        this.loopDraw();
      }
    }
  },
  beforeDestroy() {
    this.cancelDraw();
  }
};
</script>

<style lang="scss" scoped>
.canvas-demo {
  overflow-x: hidden;
  position: relative;

  canvas {
    display: block;
    margin: 0 auto;
    background-color: #eee;
  }
}
</style>
