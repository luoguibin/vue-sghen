import { Shape, Point, Line } from "./point-line-shape";

export default class Adsorption {

    shapes = [];
    aShape = null;

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;

        const shape0 = new Shape([new Point(0, 100), new Point(100, -100), new Point(-100, -100)]);
        shape0.setTranslation(500, 500);
        const shape1 = new Shape([new Point(-100, 100), new Point(100, 100), new Point(100, -100), new Point(-100, -100)]);
        shape1.setTranslation(200, 300);

        const shapes = this.shapes;
        shapes.push(shape0);
        shapes.push(shape1);

        this.draw();

        this.initListeners();
    }

    initListeners() {
        const c = this.canvas;
        const onmove = e => {
            if (this.aShape) {
                const point = getEventPoint(e);
                this.aShape.translation.addXY(point.x - this.mPoint.x, point.y - this.mPoint.y);
                this.mPoint = point;
                this.draw();
            }
        };
        const getEventPoint = function (e) {
            const rect = c.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        };
        c.addEventListener("mousedown", e => {
            this.mPoint = getEventPoint(e);
            this.getSelectShape();
            c.addEventListener("mousemove", onmove);
        });
        c.addEventListener("mouseup", e => {
            c.removeEventListener("mousemove", onmove);
            this.testAdsorption();
            this.draw();
        });
        c.addEventListener("wheel", e => {
            if (this.aShape) {
                this.aShape.radians += e.deltaY / Math.abs(e.deltaY) * Math.PI / 180;
                this.draw();
            }
        })
    }

    getSelectShape() {
        const mPoint = this.mPoint;
        this.draw(true);
        const ctx = this.canvas.getContext("2d"),
            data = ctx.getImageData(mPoint.x, mPoint.y, 1, 1).data;
        if (data[0] > 0) {
            this.aShape = this.shapes[data[0] - 1];
        } else {
            this.aShape = null;
        }
        this.draw();
    }

    testAdsorption() {
        const info = this.getFirstParallelLine();
        if (info) {
            const shape = this.aShape;
            shape.radians += info.radians;
            shape.translation.add(info.rotateOffset);
            shape.translation.add(info.distanceOffset);

            this.checkFirstClosePoint();
        }
        console.log(info);

        this.draw();
    }

    /**
    * get the first parallel line info
    */
    getFirstParallelLine() {
        const shape = this.aShape;
        if (!shape) return;

        const shapes = this.shapes,
            len = shapes.length,
            lines0 = shape.getWorldLines(),
            len0 = lines0.length
        let info;
        for (let i = 0; i < len; i++) {
            const shape1 = shapes[i];
            if (shape1 === shape) continue;

            const lines1 = shape1.getWorldLines(),
                len1 = lines1.length;

            let j, k;
            for (j = 0; j < len1; j++) {
                for (k = 0; k < len0; k++) {
                    const radians = Line.checkSegmentParallel(lines0[k], lines1[j], 8 * Math.PI / 180, 10);
                    if (radians !== null) {
                        info = {};
                        info.radians = radians;

                        const point = lines0[k].start;
                        info.distanceOffset = Line.getDistanceOffset(lines1[j], point);

                        const point_ = point.clone();
                        Point.rotate(point_, shape.translation, radians);
                        point_.x = point.x - point_.x;
                        point_.y = point.y - point_.y;
                        info.rotateOffset = point_;

                        return info;
                    }
                }
            }
        }

        return info;
    }

    checkFirstClosePoint() {
        const shape = this.aShape;
        if (!shape) return;

        const points0 = shape.getWorldPoints(),
            len0 = points0.length,
            shapes = this.shapes,
            len = shapes.length;

        for (let i = 0; i < len; i++) {
            const shape1 = shapes[i];
            if (shape1 === shape) continue;

            const points1 = shape1.getWorldPoints(),
                len1 = points1.length;

            let j, k;
            for (j = 0; j < len1; j++) {
                for (k = 0; k < len0; k++) {
                    if (Point.distance(points0[k], points1[j]) < 10) {
                        // console.log(k, j);
                        shape.translation.addXY(points1[j].x - points0[k].x, points1[j].y - points0[k].y);
                        return;
                    }
                }
            }
        }
    }

    draw(test) {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, 1280, 800);
        ctx.save();
        ctx.translate(0.5, 0.5);
        this.shapes.forEach((shape, i) => {
            shape.draw(ctx, test ? i + 1 : 0);
            shape.draw0(ctx);
        });
        ctx.restore();
    }
}