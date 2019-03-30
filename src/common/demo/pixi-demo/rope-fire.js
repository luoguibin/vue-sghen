export class RopeFire {

    rPoints = [];
    ropeLength = 10;

    rx = 5;
    ry = 0.43;
    rxValue = 0;
    ryValue = 0;

    ryValueMax = 8;

    constructor() {
        const rPoints = this.rPoints,
            rCount = 10;
        this.ropeLength = 406 / rCount;
        for (let i = 0; i < rCount; i++) {
            rPoints.push(new PIXI.Point(i * this.ropeLength, 0));
        }

        const imgUrl = require("@/assets/img/fire-02.png");
        const rope = new PIXI.mesh.Rope(PIXI.Texture.fromImage(imgUrl), rPoints);
        // rope.rotation = -Math.PI / 2;
        // rope.pivot.set(200, 203);
        rope.x = 300;
        rope.y = 400;
        rope.alpha = 0.3;
        const scale = Math.random() * 0.05 + 0.95;
        rope.scale.set(scale, scale);
        this.rope = rope;

        const g = new PIXI.Graphics();
        g.x = rope.x;
        g.y = rope.y;
        this.g = g;
    }

    addToApp(stage) {
        stage.stage.addChild(this.rope);
        stage.stage.addChild(this.g);
    }

    setRatio(index, count) {
        this.rope.alpha = 1 / count * 1.5;
        this.ry = this.ryValueMax / (count - 1);
        this.ryValue = this.ry * index;
    }

    update() {
        const rPoints = this.rPoints,
            ropeLength = this.ropeLength;
        for (let i = 1; i < rPoints.length; i++) {
            rPoints[i].y = -i * (ropeLength + this.ryValue);
            if (Math.abs(this.rxValue) < 1) {
                rPoints[i].x = this.rxValue;
            } else {
                rPoints[i].x = Math.tan(i / rPoints.length * Math.PI / 2) * this.rxValue;
            }
        }

        if (this.ryValue >= this.ryValueMax) {
            this.ryValue = 0;
        } else this.ryValue += this.ry;

        if (this.rxValue > 1) {
            this.rxValue -= this.rx;
        } else if (this.rxValue < -1) {
            this.rxValue += this.rx;
        } else {
            this.rxValue = Math.random();
        }

        // this.renderPoints();
    }

    renderPoints() {
        const g = this.g,
            rPoints = this.rPoints;

        g.clear();
        g.lineStyle(2, 0xffc2c2);
        g.moveTo(rPoints[0].x, rPoints[0].y);

        for (let i = 1; i < rPoints.length; i++) {
            g.lineTo(rPoints[i].x, rPoints[i].y);
        }

        for (let i = 1; i < rPoints.length; i++) {
            if (i === 1) {
                g.beginFill(0xffff22);
            } else {
                g.beginFill(0xff0022);
            }
            g.drawCircle(rPoints[i].x, rPoints[i].y, 10);
            g.endFill();
        }
    }
}