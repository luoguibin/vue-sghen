<template>
  <div class="shape-cut">

    <div class="cut-menu">
      <div style="display: inline-block; border: 1px solid #aaa; border-radius: 5px; padding: 2px;">
        <span style="vertical-align: middle;" @click.stop="resetCtxScale()">画布缩放：{{ctxScale.toFixed(1)}}</span>
      </div>
      <button @click.stop="onMenuClick('NewSaqure')">NewSaqure</button>
      <button @click.stop="onMenuClick('NewStar')">NewStar</button>
      <button @click.stop="onMenuClick('AutoSlice')">AutoSlice</button>
      <button @click.stop="onMenuClick('Reset')">Reset</button>
      <button @click.stop="onMenuClick('Delete')">Delete</button>
      <div style="display: inline-block; border: 1px solid #aaa; border-radius: 5px; padding: 2px;">
        <span style="vertical-align: middle;">绘制中心</span>
        <input style="vertical-align: middle;" type="checkbox" v-model="drawCenter" @change="onMenuClick('DrawCenter')" />
      </div>
      <div style="display: inline-block; border: 1px solid #aaa; border-radius: 5px; padding: 2px;">
        <span style="vertical-align: middle;">选择模式</span>
        <input style="vertical-align: middle;" type="checkbox" v-model="selectMode" @change="onMenuClick('SelectMode')" />
      </div>
      <div v-if="selectedShapes.length > 0" style="display: inline-block; border: 1px solid #aaa; border-radius: 5px; padding: 2px;">
        <span style="vertical-align: middle;">角度</span>
        <progress ref="progress" v-bind:value="selectedShapes[0].getAngle()" max="360" @click="onMenuClick('Progress', $event)"></progress>
        <span v-if="selectedShapes.length === 1" style="vertical-align: middle;">{{selectedShapes[0].getAngle()}}</span>
      </div>
      <div v-if="selectedShapes.length > 0" style="display: inline-block; border: 1px solid #aaa; border-radius: 5px; padding: 2px;">
        <span style="vertical-align: middle;">缩放</span>
        <progress ref="scale" v-bind:value="selectedShapes[0].getScale()" max="3" @click="onMenuClick('Scale', $event)"></progress>
        <span v-if="selectedShapes.length === 1" style="vertical-align: middle;">{{selectedShapes[0].getScale()}}</span>
      </div>
    </div>

    <canvas ref="canvas" @mousedown="onMouseDown($event)" @mousemove="onMouseMove($event)" @mouseup="onMouseUp($event)" @mouseout="onMouseUp($event)" @wheel="onMouseWheel($event)" @touchstart="onTouchStart($event)" @touchmove="onTouchMove($event)" @touchend="onTouchEnd($event)"></canvas>
  </div>
</template>

<script>
import {
  BaseShape,
  Cirlce,
  Ellipse
} from "@/common/demo/shapecut/shape";
import { Point } from "@/common/demo/shapecut/point";

/**
 * @info:Canvas 2D形状切割<end>
 */
export default {
  name: "ShapeCut",

  data() {
    return {
      ctx: null,
      shapes: [],
      selectedShapes: [],

      mdPoint: new Point(0, 0),
      mmPoint: new Point(0, 0),

      ctxScale: 1,

      /**
       * 1、mousedown画布空白处，取消已选中的形状
       * 2、mousedown画布非空白中，判断是否选取形状
       * 3、若1后，进入mousemove中，则进入4
       * 4、mouseup切割判断
       * 5、若2后，进入mousemove中，则进入6
       * 6、移动选中的形状
       */
      mosueStep: -1,

      selectMode: false,
      drawCenter: true
    };
  },

  created: function() {
    window.testCut = this;
  },

  mounted: function() {
    this.initCanvas();
    this.initShapes();
    this.initListeners();
  },

  methods: {
    /**
     * 初始化画布
     */
    initCanvas: function() {
      const el = this.$el,
        canvas = this.$refs.canvas;

      canvas.width = el.clientWidth;
      canvas.height = el.clientHeight;

      this.ctx = canvas.getContext("2d");
      this.ctx.width = el.clientWidth;
      this.ctx.height = el.clientHeight;
    },

    /**
     * 设置监听事件
     */
    initListeners: function() {
      document.body.onkeyup = key => {
        if (key.keyCode === 46) {
          this.deleteShape();
        }
      };
    },

    /**
     * 初始化形状
     */
    initShapes: function() {
      this.addRectShape();

      const polygon = new BaseShape();
      polygon.setPoints([
        new Point(-100, -100),
        new Point(0, 0),
        new Point(100, -100),
        new Point(100, 100),
        new Point(-100, 0)
      ]);
      polygon.setTranslation(400, 550);
      this.shapes.push(polygon);

      const cirlce = new Cirlce(88);
      cirlce.setTranslation(100, 300);
      this.shapes.push(cirlce);

      const ellipse = new Ellipse();
      ellipse.setTranslation(700, 300);
      this.shapes.push(ellipse);

      this.drawShapes();
    },

    addRectShape: function() {
      const shape = new BaseShape();
      shape.setPoints([
        new Point(-100, -50),
        new Point(100, -50),
        new Point(100, 50),
        new Point(-100, 50)
      ]);
      shape.setTranslation(400, 300);
      this.shapes.push(shape);
    },

    addStarShape: function() {
      const innerRaidus = 50;
      const outerRadius = 120;
      let innerRadians = 0 / 180 * Math.PI;
      let outerRadians = 36 / 180 * Math.PI;
      const unit = 72 / 180 * Math.PI;
      const points = [];

      for (let i = 0; i < 5; i++) {
        const point1 = new Point(
          innerRaidus * Math.sin(innerRadians),
          innerRaidus * Math.cos(innerRadians)
        );
        const point2 = new Point(
          outerRadius * Math.sin(outerRadians),
          outerRadius * Math.cos(outerRadians)
        );
        points.push(point1);
        points.push(point2);

        innerRadians += unit;
        outerRadians += unit;
      }

      const shape = new BaseShape();
      shape.setPoints(points);
      shape.setTranslation(400, 300);
      this.shapes.push(shape);
    },

    onMenuClick: function(menu, e) {
      switch (menu) {
        case "NewSaqure":
          this.addRectShape();
          this.drawShapes();
          break;
        case "NewStar":
          this.addStarShape();
          this.drawShapes();
          break;
        case "AutoSlice":
          this.autoShapeSlice();
          break;
        case "Reset":
          this.ctxScale = 1;
          for (let i = 0; i < this.shapes.length; ) {
            const shape = this.shapes[i];
            if (shape.getIsSlice()) {
              this.shapes.splice(i, 1);
            } else {
              shape.resetOrigin();
              i++;
            }
          }

          this.drawShapes();
          break;
        case "Delete":
          this.deleteShape();
          break;
        case "SelectMode":
          this.selectedShapes.forEach(shape => {
            shape.setIsSelected(false);
          });
          this.selectedShapes = [];
          this.drawShapes();
          break;
        case "DrawCenter":
          this.shapes.forEach(shape => {
            shape.setDrawCenter(this.drawCenter);
          });
          this.drawShapes();
          break;
        case "Progress":
          if (e.target === this.$refs.progress) {
            const rect = this.$refs.progress.getBoundingClientRect();
            const xVal = (e.clientX - rect.left) / rect.width * 360;
            this.selectedShapes.forEach(shape => {
              shape.setAngle(xVal);
            });

            this.drawShapes();
          }
          break;
        case "Scale":
          if (e.target === this.$refs.scale) {
            const rect = this.$refs.scale.getBoundingClientRect();
            const xVal = (e.clientX - rect.left) / rect.width * 3;

            this.selectedShapes.forEach(shape => {
              shape.setScale(xVal);
            });

            this.drawShapes();
          }
          break;
      }
    },
    onTouchStart: function(e) {
      this.onMouseDown(e.touches[0]);
    },
    onTouchMove: function(e) {
      this.onMouseMove(e.touches[0]);
    },
    onTouchEnd: function(e) {
      this.onMouseUp();
    },

    onMouseDown: function(e) {
      this.mosueStep = 0;

      const obj = this.getRelativePoint(e);
      this.mdPoint.set(obj.x, obj.y);
      this.mmPoint.set(obj.x, obj.y);

      this.checkSelectShape();

      this.drawShapes();
    },
    onMouseMove: function(e) {
      if (this.mosueStep < 0) return;
      this.mosueStep = 1;

      const obj = this.getRelativePoint(e);
      if (this.selectedShapes.length > 0) {
        this.selectedShapes.forEach(shape => {
          shape.addTranslation(obj.x - this.mmPoint.x, obj.y - this.mmPoint.y);
        });
      }
      this.mmPoint.set(obj.x, obj.y);

      this.drawShapes();
    },
    onMouseUp: function(e) {
      if (this.mosueStep === 1 && this.selectedShapes.length === 0) {
        if (this.selectMode) {
          this.checkSelectShapes();
        } else {
          this.checkShapeSlice();
        }
      }

      this.mosueStep = -1;
      this.drawShapes();
    },
    onMouseWheel: function(e) {
      if (!this.ctx) return;

      if (e.deltaY < 0) {
        this.ctxScale += 0.05;
        if (this.ctxScale > 2.5) this.ctxScale = 2.5;
      } else {
        this.ctxScale -= 0.05;
        if (this.ctxScale < 0.3) this.ctxScale = 0.3;
      }

      this.drawShapes();
    },

    resetCtxScale: function() {
      this.ctxScale = 1;
      this.drawShapes();
    },

    /**
     * 删除选中的形状
     */
    deleteShape: function(shapes) {
      if (shapes === undefined) shapes = this.selectedShapes;
      console.log("deleteShape()");

      if (shapes) {
        shapes.forEach(dShape => {
          const index = this.shapes.findIndex(shape => {
            return dShape === shape;
          });
          if (index > -1 && dShape.getEnable()) this.shapes.splice(index, 1);
        });

        this.selectedShapes = [];
        this.drawShapes();
      }
    },

    /**
     * 绘制所有形状
     */
    drawShapes: function() {
      this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
      this.ctx.save();
      this.ctx.scale(this.ctxScale, this.ctxScale);

      this.shapes.forEach(shape => {
        shape.draw(this.ctx);
      });

      this.drawLine();
      this.ctx.restore();
    },

    /**
     * 绘制切割线
     */
    drawLine: function() {
      if (this.selectedShapes.length > 0 || this.mosueStep < 0) return;

      this.ctx.strokeStyle = "#ee2233";
      this.ctx.beginPath();

      this.ctx.moveTo(this.mdPoint.x, this.mdPoint.y);
      if (this.selectMode) {
        this.ctx.lineTo(this.mmPoint.x, this.mdPoint.y);
        this.ctx.lineTo(this.mmPoint.x, this.mmPoint.y);
        this.ctx.lineTo(this.mdPoint.x, this.mmPoint.y);
      } else {
        this.ctx.lineTo(this.mmPoint.x, this.mmPoint.y);
      }

      this.ctx.closePath();
      this.ctx.stroke();
    },

    /**
     * 通过像素选中单个形状
     */
    checkSelectShape: function() {
      this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);

      this.shapes.forEach((shape, index) => {
        shape.draw(this.ctx, index);
      });
      const rbga = this.ctx.getImageData(this.mdPoint.x, this.mdPoint.y, 1, 1)
        .data;

      if (rbga[2] === 88 && rbga[0] >= 0 && rbga[1] >= 0) {
        if (!this.selectMode) {
          this.selectedShapes.forEach(shape => {
            shape.setIsSelected(false);
          });
          this.selectedShapes = [this.shapes[rbga[0] + rbga[1] * 255]];
          this.selectedShapes[0].setIsSelected(true);
        }
      } else {
        this.selectedShapes.forEach(shape => {
          shape.setIsSelected(false);
        });
        this.selectedShapes = [];
      }
    },

    /**
     * 框选形状，若偏移质心在框中，则选中
     */
    checkSelectShapes: function() {
      const minX =
        this.mdPoint.x < this.mmPoint.x ? this.mdPoint.x : this.mmPoint.x;
      const minY =
        this.mdPoint.y < this.mmPoint.y ? this.mdPoint.y : this.mmPoint.y;
      const maxX =
        this.mdPoint.x > this.mmPoint.x ? this.mdPoint.x : this.mmPoint.x;
      const maxY =
        this.mdPoint.y > this.mmPoint.y ? this.mdPoint.y : this.mmPoint.y;

      this.selectedShapes = [];
      this.shapes.forEach(shape => {
        shape.setIsSelected(false);
        const translation = shape.getTranslation();

        if (translation.x >= minX && translation.x <= maxX) {
          if (translation.y >= minY && translation.y <= maxY) {
            shape.setIsSelected(true);
            this.selectedShapes.push(shape);
          }
        }
      });
    },

    autoShapeSlice: function() {
      const unit = 30;
      const wCount = this.ctx.width / unit;
      for (let i = 0; i < wCount; i++) {
        this.mdPoint.set(unit * i, 0);
        this.mmPoint.set(unit * i, this.ctx.height);
        this.checkShapeSlice();
      }

      const hCount = this.ctx.height / unit;
      for (let i = 0; i < hCount; i++) {
        this.mdPoint.set(0, unit * i);
        this.mmPoint.set(this.ctx.width, unit * i);
        this.checkShapeSlice();
      }

      this.drawShapes();
    },

    /**
     * 检测切割形状
     */
    checkShapeSlice: function() {
      let newShapes = [];
      let indexs = [];

      this.shapes.forEach((shape, index) => {
        const tempShapes = shape.checkSlice(this.mdPoint, this.mmPoint);
        tempShapes.forEach(tempShape => {
          newShapes.push(tempShape);
        });
        if (tempShapes.length > 0) indexs.push(index);
      });

      for (let i = indexs.length - 1; i >= 0; i--) {
        this.shapes[indexs[i]].setEnable(false);
      }

      newShapes.forEach(newShape => {
        this.shapes.push(newShape);
      });
    },

    getRelativePoint: function(e) {
      const obj = { x: 0, y: 0 };
      const rect = this.$refs.canvas.getBoundingClientRect();
      obj.x = (e.clientX - rect.left) / this.ctxScale;
      obj.y = (e.clientY - rect.top) / this.ctxScale;
      return obj;
    }
  }
};
</script>

<style scoped>
.shape-cut {
  height: 100%;
  overflow: hidden;
}

.cut-menu {
  width: 100%;
  position: absolute;
}
</style>


