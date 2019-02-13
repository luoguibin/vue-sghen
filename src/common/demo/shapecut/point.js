export class Point {

    x = 0;
    y = 0;

    saveX = 0;
    saveY = 0;

    constructor(x, y) {
        if (x || y)
            this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setPoint(point) {
        return this.set(point.x, point.y);
    }

    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    addPoint(point) {
        return this.add(point.x, point.y);
    }

    minus(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    }

    minusPoint(point) {
        return this.minus(point.x, point.y);
    }

    /**
     * 围绕坐标点center(rx0,ry0)逆时针旋转radians角度
     * @param {*} radians 弧度
     * @param {*} center 旋转点
     * @returns {this}
     */
    rotate(radians, center) {
        let rx0 = 0, ry0 = 0;
        if (center) {
            rx0 = center.x;
            ry0 = center.y;
        }

        const cosVal = Math.cos(radians);
        const sinVal = Math.sin(radians);
        const x0 = (this.x - rx0) * cosVal - (this.y - ry0) * sinVal + rx0;
        const y0 = (this.x - rx0) * sinVal + (this.y - ry0) * cosVal + ry0;

        this.x = x0;
        this.y = y0;
        return this;
    }

    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    save() {
        this.saveX = this.x;
        this.saveY = this.y;
    }

    restore() {
        this.x = this.saveX;
        this.y = this.saveY;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `{x:${this.x},y:${this.y}}`
    }
}