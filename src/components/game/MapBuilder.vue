<template>
  <div class="map-builder" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 100,
      height: 100,
      unit: 9,
      mapMatrix: []
    };
  },
  mounted() {
    window.mapBuilder = this;
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const c = this.$refs.canvas,
        el = this.$el;
      c.setAttribute("width", el.clientWidth);
      c.setAttribute("height", el.clientHeight);

      const ctx = c.getContext("2d");
      this.ctx = ctx;

      const w = this.width,
        h = this.height,
        mapMatrix = this.mapMatrix;

      for (let j = 0; j < h; j++) {
        const arr = [];
        for (let i = 0; i < w; i++) {
          if (j === 0 || j === h - 1) {
            arr.push(1);
          } else if (i === 0 || i === w - 1) {
            arr.push(1);
          } else {
            arr.push(0);
          }
        }
        mapMatrix.push(arr);
      }
      this.drawMap();
    },

    drawMap() {
      const ctx = this.ctx,
        el = this.$el,
        width = el.clientWidth,
        height = el.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const w = this.width,
        h = this.height,
        unit = this.unit,
        mapMatrix = this.mapMatrix;

      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.strokeStyle = "black";
      for (let i = 0; i <= w; i++) {
        ctx.beginPath();
        ctx.moveTo(unit * i, 0);
        ctx.lineTo(unit * i, unit * h);
        ctx.stroke();
      }
      for (let j = 0; j <= h; j++) {
        ctx.beginPath();
        ctx.moveTo(0, unit * j);
        ctx.lineTo(unit * w, unit * j);
        ctx.stroke();
      }

      ctx.fillStyle = "#14unitacf";
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          if (mapMatrix[j][i] === 1) {
            ctx.fillRect(unit * i + 1, unit * j + 1, unit - 2, unit - 2);
          }
        }
      }
      ctx.restore();
    },
    printMapData(mapMatrix) {
      if (!mapMatrix) mapMatrix = this.mapMatrix;
      let str = "[";
      mapMatrix.forEach(arr => {
        str += "[" + arr.toString() + "],";
      });
      str += "]";
      return str;
    },
    onMouseDown(e) {
      this.isDown = e.button;
    },
    onMouseMove(e) {
      if (this.isDown >= 0) {
        const unit = this.unit,
          mapMatrix = this.mapMatrix,
          x = e.clientX,
          y = e.clientY,
          i = Math.floor(x / unit),
          j = Math.floor(y / unit);
        const v = mapMatrix[j][i];
        if (v !== undefined) {
          if (this.isDown === 0) {
            if (v === 1) return;
            mapMatrix[j][i] = 1;
          } else {
            if (v === 0) return;
            mapMatrix[j][i] = 0;
          }
          this.drawMap();
        }
      }
    },
    onMouseUp(e) {
      this.onMouseMove(e);
      this.isDown = -1;
    }
  }
};
</script>

<style>
.map-builder {
  height: 100%;
  overflow: hidden;
}
</style>
