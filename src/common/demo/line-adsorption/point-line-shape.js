export class Point {

    x = 0;
    y = 0;

    constructor(x, y) {
        this.setXY(x, y);
    }

    setX(x) {
        if (x !== undefined)
            this.x = x;
    }

    setY(y) {
        if (y !== undefined)
            this.y = y;
    }

    setXY(x, y) {
        this.setX(x);
        this.setY(y);
    }

    addXY(x, y) {
        if (x !== undefined) this.x += x;
        if (y !== undefined) this.y += y;
    }

    add(point) {
        this.addXY(point.x, point.y);
    }

    /**
     * rotate the point
     * @param {Point} base 
     * @param {Number} radians 
     */
    rotate00(radians) {
        Point.rotate(this, new Point(0, 0), radians);
    }

    /**
     * copyt the point value
     * @param {Point} point 
     */
    copy(point) {
        this.setXY(point.x, point.y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    /**
     * calculate the distance between two points
     * @param {Point} point0 
     * @param {Point} point1 
     */
    static distance(point0, point1) {
        return Math.sqrt(Point.distancePow2(point0, point1));
    }

    /**
     * get the square of distance between two points
     * @param {Point} point0 
     * @param {Point} point1 
     */
    static distancePow2(point0, point1) {
        const value0 = point0.x - point1.x,
            value1 = point0.y - point1.y;
        return Math.pow(value0, 2) + Math.pow(value1, 2);
    }

    /**
     * rotate the `point` `radians` degrees around the `base`
     * @param {Point} point
     * @param {Point} base 
     * @param {Number} radians 
     */
    static rotate(point, base, radians) {
        const cosValue = Math.cos(radians),
            sinValue = Math.sin(radians),
            rx = point.x - base.x,
            ry = point.y - base.y;

        point.x = rx * cosValue - ry * sinValue + base.x;
        point.y = rx * sinValue + ry * cosValue + base.y;
    }
}

export class Line {

    start = new Point();
    end = new Point();


    /**
     * @param {Number | Array<Number>} x0 
     * @param {Number} y0 
     * @param {Number} x1 
     * @param {Number} y1 
     */
    constructor(x0, y0, x1, y1) {
        if (x0 instanceof Array) {
            this.start.setXY(x0[0], x0[1]);
            this.end.setXY(x0[2], x0[3]);
        } else {
            this.start.setXY(x0, y0);
            this.end.setXY(x1, y1);
        }
    }

    /**
     * set start and end points
     * @param {Point} start 
     * @param {Point} end 
     */
    setPoints(start, end) {
        this.start = start;
        this.end = end;
        return this;
    }

    /**
     * get line k
     * @param {Line} line 
     */
    static getLineK(line) {
        const xValue = line.end.x - line.start.x;
        let k;
        if (xValue !== 0) {
            k = (line.end.y - line.start.y) / xValue;
        }
        return k;
    }

    /**
     * get the radians of the `line`, based on the `line.end` point,
     * and return ccw circle radians
     * @param {Line} line 
     * @returns {Number} [0, Math.PI*2]
     */
    static getCircleRadians(line) {
        const start = line.start,
            end = line.end;
        // `atan2` ∈ (PI, PI]
        let radians = Math.atan2(end.y - start.y, end.x - start.x);
        if (radians < 0)
            radians += Math.PI * 2;
        return radians;
    }

    /**
     * get the distance between point and line
     * @param {Line} line 
     * @param {Point} point 
     */
    static pointDistance(line, point) {
        const start = line.start,
            end = line.end,
            value = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y),
            r = value / Point.distancePow2(start, end);

        if (r <= 0) {
            // the `point` is on the left of the line-segment
            return Point.distance(start, point);
        } else if (r >= 1) {
            // the `point` is on the right of the line-segment
            return Point.distance(end, point);
        } else {
            // the `point` is in the section of the line-segment
            const ac = r * Point.distance(start, end);
            return Math.sqrt(Point.distancePow2(start, point) - Math.pow(ac, 2));
        }
    }

    /**
     * check the parallel of the two lines
     * @param {Line} line 
     * @param {Line} base
     * @param {Number} limit the radians of parallel limit
     * @returns {Number}    `null`:   the two lines are not parallel
     *                      `value`:  the `line` should rotate `value` degrees to fit parallel
     */
    static checkLineParallel(line, base, limit) {
        if (limit === undefined) {
            limit = 0.0001;
        }

        const lineRadians = Line.getCircleRadians(line),
            baseRadians = Line.getCircleRadians(base);

        // getCircleRadians() return a section of [0, Math.PI*2]
        const a = 180 / Math.PI;
        // console.log("base=" + a * baseRadians);
        // console.log("line=" + a * lineRadians);

        if (baseRadians >= lineRadians) {
            // console.log("the base angle is bigger than line");
            let value = baseRadians - lineRadians;
            if (value <= limit) {
                return value;
            }

            value -= Math.PI;
            if (Math.abs(value) <= limit) {
                return value;
            }

            value -= Math.PI;
            if (Math.abs(value) <= limit) {
                return value;
            }
        } else {
            // console.log("the base angle is smaller than line");
            let value = lineRadians - baseRadians;
            if (value <= limit) {
                return -value;
            }

            value -= Math.PI;
            if (Math.abs(value) <= limit) {
                return -value;
            }

            value -= Math.PI;
            if (Math.abs(value) <= limit) {
                return -value;
            }
        }

        return null;
    }

    /**
     * check the parallel of the two line segments
     * @param {Line} line
     * @param {Line} base 
     * @param {Number} limit0 the radians of parallel limit
     * @param {Number} limit1 the distance of parallel limit
     * @returns {Number}    `null`:   the two lines are not parallel
     *                      `value`:  the `line` should rotate `value` degrees to fit parallel
     */
    static checkSegmentParallel(line, base, limit0, limit1) {
        const value = Line.checkLineParallel(line, base, limit0);
        if (value === null) return null;
        // console.log("checkSegmentParallel() " + value);
        // chekc if the line-segments are close
        if (limit1 === undefined) limit1 = 8;
        let value_ = Line.checkSegmentsClose(line, base, limit1);
        if (value_ !== null) {
            return value;
        }
        value_ = Line.checkSegmentsClose(base, line, limit1);
        if (value_ !== null) {
            return value;
        }
        return null;
    }

    /**
     * check the lines if they are close
     * @param {Line} line0 
     * @param {Line} line1 
     * @param {Number} limit
     */
    static checkSegmentsClose(line0, line1, limit) {
        let value = Line.pointDistance(line0, line1.start);
        // console.log("pointDistance() line1.start to line0", value);
        if (value <= limit) {
            return value;
        }

        value = Line.pointDistance(line0, line1.end);
        // console.log("pointDistance() line1.end to line0", value);
        if (value <= limit) {
            return value;
        }
        return null;
    }

    /**
     * get distance offset
     * @param {Line} line 
     * @param {Point} point 
     */
    static getDistanceOffset(line, point) {
        const k = Line.getLineK(line),
            start = line.start;
        let x0, y0;
        if (k !== undefined) {
            const b = start.y - k * start.x;
            if (k !== 0) {
                const k_ = -1 / k;
                x0 = (b - point.y + k_ * point.x) / (k_ - k),
                    y0 = k * x0 + b;
            } else {
                x0 = point.x;
                y0 = start.y;
            }
        } else {
            x0 = start.x;
            y0 = point.y;
        }
        // console.log(line, point, { x: x0, y: y0, k: k });
        return new Point(x0 - point.x, y0 - point.y);
    }
}

export class Shape {

    translation = new Point();
    radians = 0;
    points = [];

    constructor(points) {
        this.setPoints(points);
    }

    /**
     * set x and y
     * @param {Number} x 
     * @param {Number} y 
     */
    setTranslation(x, y) {
        this.translation.setXY(x, y);
        return this;
    }

    /**
     * set points
     * @param {Array<Point>} points 
     */
    setPoints(points) {
        if (!points) return;
        this.points = points;
    }

    /**
     * get the world points
     * @returns {Array<Line>}
     */
    getWorldLines() {
        const points = this.getWorldPoints(),
            len = points.length,
            lines = [];

        for (let i = 0; i < len; i++) {
            const line = new Line(),
                start = line.start,
                end = line.end;

            start.copy(points[i]);
            end.copy(points[(i + 1) % len]);

            lines.push(line);
        }
        return lines;
    }

    /**
     * get world points
     */
    getWorldPoints() {
        const points = this.points,
            len = points.length,
            radians = this.radians,
            x = this.translation.x,
            y = this.translation.y,
            points_ = [];

        for (let i = 0; i < len; i++) {
            const point = new Point();
            point.copy(points[i])
            point.rotate00(radians);
            point.addXY(x, y);
            points_.push(point);
        }
        return points_;
    }

    /**
     * draw shape
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx, val) {
        ctx.save();
        ctx.translate(this.translation.x, this.translation.y);
        ctx.rotate(this.radians);

        ctx.beginPath();
        const points = this.points,
            len = points.length;
        for (let i = 0; i < len; i++) {
            if (i === 0) {
                ctx.moveTo(points[i].x, points[i].y);
            } else {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        if (val) {
            ctx.fillStyle = `rgba(${val}, 0, 0, 1)`;
            ctx.fill();
        }
        ctx.restore();
    }

    /**
     * draw0
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw0(ctx) {
        const points = this.getWorldPoints();
        ctx.save();
        ctx.beginPath();
        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
            ctx.fillText(i, point.x, point.y);
        });
        ctx.closePath();
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
    }
}