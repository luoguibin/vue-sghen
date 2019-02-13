import { Point } from "./point.js";

export class BaseShape {

    /**
     * 该形状是否可用
     */
    enable = true;

    /**
     * 是否由切割创建
     */
    isSlice = false;

    /**
     * 形状的顶点数组，顶点是相对于原点的坐标
     */
    points = [];

    /**
     * 形状画笔绘制样式
     */
    fillStyle = "#148acf";

    selectedFillStyle = "#16c6d8";

    curFillStyle = "#148acf";

    strokeStyle = "rgb(37, 156, 29)";

    lineWidth = 5;

    /**
     * 是否绘制位移中心
     */
    drawTransPoint = true;

    fillTransPoint = "#ee2233";

    // 旋转角度
    radians = 0.0;

    // 缩放比例
    scale = 1;

    /**
     * 形状位移
     */
    translation = new Point();

    /**
     * 非切割创建的形状的原始质心与切割后产生的质心偏移坐标，
     * 每次切割后需累加父形状的质心偏移坐标
     */
    transCenter = new Point();

    /**
     * 自定义多边形时质心默认坐标原点
     * @param {Point[]} points 
     */
    constructor(points) {
        this.setPoints(points);
    }

    setPoints(points) {
        if (points && points.length > 2) {
            this.points = points;
        }
    }

    setEnable(enable) {
        this.enable = enable;
    }

    getEnable() {
        return this.enable;
    }

    setIsSlice(isSlice) {
        this.isSlice = isSlice;
    }

    getIsSlice() {
        return this.isSlice;
    }

    /**
     * 设置形状位移
     * @param {*} x 
     * @param {*} y 
     */
    setTranslation(x, y) {
        this.translation.set(x, y);
    }

    /**
     * 累加位移
     * @param {*} x 
     * @param {*} y 
     */
    addTranslation(x, y) {
        this.translation.add(x, y);
    }

    setOTranstion(point) {
        this.oTranslation.setPoint(point);
    }

    /**
     * 累加质心偏移
     * @param {Point} point 
     */
    addTransCenter(point) {
        this.transCenter.addPoint(point);
    }

    /**
     * 供切割创建的形状设置父形状的质心偏移
     * @param {Point} point 
     */
    setTransCenter(point) {
        this.transCenter.set(point.x, point.y);
    }

    /**
     * 标记是否选中，供形状选中绘制
     * @param {*} isSelected 
     */
    setIsSelected(isSelected) {
        if (isSelected) {
            this.curFillStyle = this.selectedFillStyle;
        } else {
            this.curFillStyle = this.fillStyle;
        }
    }

    getTranslation() {
        return this.translation;
    }

    /**
     * 设置弧度
     * @param {*} degrees  角度
     */
    setAngle(degrees) {
        this.radians = degrees / 180 * Math.PI;
    }

    getAngle() {
        return (this.radians / Math.PI * 180).toFixed(1);
    }

    setScale(scale) {
        if (scale < 0.1) scale = 0.1;
        else if (scale > 3) scale = 3;
        this.scale = scale;
    }

    getScale() {
        return this.scale.toFixed(1);
    }

    setDrawCenter(drawTransPoint) {
        this.drawTransPoint = drawTransPoint;
    }

    resetOrigin() {
        this.scale = 1;
        this.radians = 0;
        this.enable = true;
    }

    /**
     * 绘制形状
     * @param {*} ctx 
     * @param {*} testIndex
     */
    draw(ctx, testIndex) {
        if (!this.enable) return;

        ctx.save();
        ctx.translate(this.translation.x, this.translation.y);
        ctx.rotate(this.radians);
        ctx.scale(this.scale, this.scale);

        ctx.lineWidth = this.lineWidth / this.scale;
        ctx.fillStyle = this.curFillStyle;
        ctx.strokeStyle = this.strokeStyle;
        if (testIndex !== undefined) {
            const r = testIndex % 255;
            const g = (testIndex - r) / 255;
            ctx.fillStyle = `rgb(${r}, ${g}, 88)`;
        }

        ctx.beginPath();
        this.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y)
            }
        });
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        if (this.drawTransPoint) {
            ctx.fillStyle = this.fillTransPoint;
            ctx.beginPath();
            ctx.arc(0, 0, 3 / this.scale, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * 检测切割
     * @param {Point} point0 
     * @param {Point} point1
     * @returns undefined or new baseshapes
     */
    checkSlice(point0, point1) {
        const newShapes = [];
        if (!this.enable) return newShapes;

        // 平移切割线
        point0.save();
        point1.save();
        point0.minus(this.translation.x, this.translation.y);
        point1.minus(this.translation.x, this.translation.y);
        point0.rotate(-this.radians).scale(1 / this.scale);
        point1.rotate(-this.radians).scale(1 / this.scale);

        const intersections = [];
        const pCount = this.points.length;
        for (let i = 1; i <= pCount; i++) {
            // 计算获取相交点
            const intersection = this.calIntersection(this.points[i - 1], this.points[i % pCount], point0, point1);
            if (intersection) {
                intersection.index = i - 1;
                intersections.push(intersection);
            }
        }

        if (intersections.length === 2) {
            const points1 = [];
            // 筛选第一个形状的点（第一部分）
            for (let i = 0; i <= intersections[0].index; i++) {
                points1.push(this.points[i].copy());
            }
            // 采用copy是因为上面增加了个index属性 
            points1.push(intersections[0].copy());
            points1.push(intersections[1].copy());

            // 筛选第一个形状的点（第二部分）
            for (let i = intersections[1].index + 1; i < this.points.length; i++) {
                points1.push(this.points[i].copy());
            }

            const shape1 = new BaseShape(points1);
            shape1.setIsSlice(true);
            shape1.setAngle(this.getAngle());
            shape1.setScale(this.scale);

            const aCenter1 = shape1.resetAreaCenter();
            shape1.setTransCenter(this.transCenter);
            shape1.addTransCenter(aCenter1);
            aCenter1.rotate(this.radians).scale(2 * this.scale);// 可用2倍原质心位置便宜产生切割分割动画
            aCenter1.addPoint(this.translation);
            shape1.setTranslation(aCenter1.x, aCenter1.y);

            newShapes.push(shape1);


            // 筛选第二个形状的点
            const points2 = [intersections[0].copy()];
            for (let i = intersections[0].index + 1; i <= intersections[1].index; i++) {
                points2.push(this.points[i].copy());
            }
            points2.push(intersections[1].copy());

            const shape2 = new BaseShape(points2);
            shape2.setIsSlice(true);
            shape2.setAngle(this.getAngle());
            shape2.setScale(this.scale);

            const aCenter2 = shape2.resetAreaCenter();
            shape2.setTransCenter(this.transCenter);
            shape2.addTransCenter(aCenter2);
            aCenter2.rotate(this.radians).scale(2 * this.scale);
            aCenter2.addPoint(this.translation);
            shape2.setTranslation(aCenter2.x, aCenter2.y);

            newShapes.push(shape2);
        }

        point0.restore();
        point1.restore();

        return newShapes;
    }

    /**
     * 计算两线段是否相交
     * （copy code）
     * @param {*} a 
     * @param {*} b 
     * @param {*} c 
     * @param {*} d 
     * @returns {Point}
     */
    calIntersection(a, b, c, d) {

        // 三角形abc 面积的2倍
        const area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

        // 三角形abd 面积的2倍
        const area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
        if (area_abc * area_abd >= 0) {
            return;
        }

        // 三角形cda 面积的2倍
        const area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        const area_cdb = area_cda + area_abc - area_abd;
        if (area_cda * area_cdb >= 0) {
            return;
        }

        //计算交点坐标
        const t = area_cda / (area_abd - area_abc);
        const dx = t * (b.x - a.x),
            dy = t * (b.y - a.y);
        return new Point(a.x + dx, a.y + dy);
    }

    /**
     * 计算三角形的面积
     * （copy code）
     * @param {*} p0 
     * @param {*} p1 
     * @param {*} p2 
     */
    calTriangleArea(p0, p1, p2) {
        var area = 0.0;
        area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
        return area / 2;
    }

    /**
     * 重置多边形的质心为原点
     * （copy code）
     * @returns {Point} 质心归原点前的位置
     */
    resetAreaCenter() {
        if (this.points.length < 2)
            return { x: 0, y: 0 };

        let sum_x = 0;
        let sum_y = 0;
        let sum_area = 0;
        let p1 = this.points[1];

        for (let i = 2; i < this.points.length; i++) {
            const p2 = this.points[i];
            const area = this.calTriangleArea(this.points[0], p1, p2);
            sum_area += area;
            sum_x += (this.points[0].x + p1.x + p2.x) * area;
            sum_y += (this.points[0].y + p1.y + p2.y) * area;
            p1 = p2;
        }

        const xx = sum_x / sum_area / 3;
        const yy = sum_y / sum_area / 3;


        this.points.forEach(point => {
            point.minus(xx, yy);
        });

        return new Point(xx, yy);
    }
}

export class Cirlce extends BaseShape {

    radius = 100;

    constructor(radius) {
        super();

        if (radius && radius >= 10)
            this.radius = radius;

        this.initPoints();
    }

    initPoints() {
        for (let i = 0; i < 360; i = i + 5) {
            const radians = i / 180 * Math.PI;
            const point = new Point(this.radius * Math.sin(radians), this.radius * Math.cos(radians));
            this.points.push(point);
        }
    }
}

export class Ellipse extends BaseShape {

    radiusX = 100;
    radiusY = 60;

    constructor(radiusX, radiusY) {
        super();

        if (radiusX > 10)
            this.radiusX = radiusX;
        if (radiusY > 10)
            this.radiusY = radiusY;

        this.initPoints();
    }

    initPoints() {
        for (let i = 0; i < 360; i = i + 5) {
            const radians = i / 180 * Math.PI;
            const x = this.radiusX * Math.sin(radians);
            const y = this.radiusY * Math.cos(radians);
            const point = new Point(x, y);
            this.points.push(point);
        }
    }
}