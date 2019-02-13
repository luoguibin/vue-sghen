export class Sculpture {

    datas = [
        { x: 108, y: 120 },
        { x: 117, y: 105 },
        { x: 111, y: 101 },
        { x: 103, y: 108 },
        { x: 117, y: 105 },
        { x: 105, y: 117 },
        { x: 98, y: 108 },
        { x: 105, y: 97 },
        { x: 110, y: 110 },
    ];
    minX = 98;
    maxX = 117;

    minY = 97; maxY = 120;
    valX = this.maxX - this.minX;
    valY = this.maxY - this.minY;

    ratio = 1;

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        this.ctx = ctx;
        if (!ctx.width) {
            ctx.width = ctx.canvas.width;
            ctx.height = ctx.canvas.height;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        ctx.fillRect(0, 0, ctx.width, ctx.height);
        ctx.translate(0.5, 0.5);

        this.ratio = ctx.width / 512;
        this.canLoop = true;
        this.angle = 0;
        this.loop = this.loop.bind(this);
        this.loop();

        // const str = "luoguibin",
        //     len = str.length;
        // let temp = "";
        // for (let i = 0; i < len; i++) {
        //     temp += str.charCodeAt(i) + " ";
        // }
        // console.log(temp);
    }

    loop() {
        this.draw();
        this.calculate();
        this.canLoop && setTimeout(this.loop, 1);
    }

    calculate() {
        this.angle += 1;
        if (this.angle >= 360 * 1.0 || this.angle <= -360 * 1) {
            this.angle = 0;
            this.canLoop = false;
            this.drawSign();
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        // ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.globalAlpha = 0.25;

        const datas = this.datas;
        const minX = this.minX, maxX = this.maxX, valX = this.valX;
        const minY = this.minY, maxY = this.maxY, valY = this.valY;

        const len = datas.length;
        ctx.save();
        ctx.translate(150 * this.ratio, 160 * this.ratio);
        ctx.filter = "blur(1px)";
        ctx.scale(10 * this.ratio, 10 * this.ratio);
        ctx.lineWidth = 1 / 2;
        ctx.font = "2px serif";
        ctx.strokeStyle = "rgba(65,85,225,0.88)";
        ctx.fillStyle = "#16c658";
        if (false) {
            for (let i = 0; i < len; i += 3) {
                ctx.beginPath();
                ctx.arc(datas[i].x - minX, datas[i + 1].x - minX, datas[i + 2].x - minX, 0, 2 * Math.PI, true);
                ctx.fillText(i + "x", datas[i].x - minX, datas[i + 1].x - minX);
                ctx.stroke();
                // ctx.fill();

                ctx.beginPath();
                ctx.arc(datas[i].y - minY, datas[i + 1].y - minY, datas[i + 2].y - minY, 0, 2 * Math.PI, true);
                ctx.fillText(i + "y", datas[i].y - minY, datas[i + 1].y - minY);
                ctx.stroke();
                // ctx.fill();
            }
        }
        // ctx.stroke();
        // ctx.fill();  

        const px0 = this.getPoint(this.angle * 0.8, datas[2].x - minX),
            px1 = this.getPoint(this.angle * 1.0, datas[5].x - minX),
            px2 = this.getPoint(this.angle * 1.1, datas[8].x - minX),

            py0 = this.getPoint(this.angle * 1.2, datas[2].y - minY),
            py1 = this.getPoint(this.angle * 0.9, datas[5].y - minY),
            py2 = this.getPoint(this.angle * 0.5, datas[8].y - minY);

        if (false) {
            ctx.fillRect(datas[0].x - minX + px0.x, datas[1].x - minX + px0.y, 0.5, 0.5);
            ctx.fillRect(datas[0].y - minY + py0.x, datas[1].y - minY + py0.y, 0.5, 0.5);
            ctx.fillRect(datas[3].x - minX + px1.x, datas[4].x - minX + px1.y, 0.5, 0.5);
            ctx.fillRect(datas[3].y - minY + py1.x, datas[4].y - minY + py1.y, 0.5, 0.5);
            ctx.fillRect(datas[6].x - minX + px2.x, datas[7].x - minX + px2.y, 0.5, 0.5);
            ctx.fillRect(datas[6].y - minY + py2.x, datas[7].y - minY + py2.y, 0.5, 0.5);
            ctx.fillRect(datas[0].x - minX + px0.x, datas[1].x - minX + px0.y, 0.5, 0.5);
        }

        ctx.beginPath();

        if (false) {
            if (Math.random() < 0.5) {
                ctx.fillStyle = "#16a698";
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, 0)`;
            }
        } else {
            // const v = Math.random() * 0.0001 + 0.1;
            // ctx.fillStyle = `#${Math.floor(v * 0xffffff).toString(16)}`
        }
        if (true) {
            ctx.moveTo(datas[0].x - minX + px0.x, datas[1].x - minX + px0.y);
            if (true) {
                ctx.bezierCurveTo(
                    datas[0].y - minY + py0.x, datas[1].y - minY + py0.y,
                    datas[3].x - minX + px1.x, datas[4].x - minX + px1.y,
                    datas[3].y - minY + py1.x, datas[4].y - minY + py1.y
                );
                ctx.bezierCurveTo(
                    datas[6].x - minX + px2.x, datas[7].x - minX + px2.y,
                    datas[6].y - minY + py2.x, datas[7].y - minY + py2.y,
                    datas[0].x - minX + px0.x, datas[1].x - minX + px0.y
                );
            } else {
                ctx.bezierCurveTo(
                    datas[3].x - minX + px1.x, datas[4].x - minX + px1.y,
                    datas[6].x - minX + px2.x, datas[7].x - minX + px2.y,
                    datas[0].y - minY + py0.x, datas[1].y - minY + py0.y
                );
                ctx.bezierCurveTo(
                    datas[3].y - minY + py1.x, datas[4].y - minY + py1.y,
                    datas[6].y - minY + py2.x, datas[7].y - minY + py2.y,
                    datas[0].x - minX + px0.x, datas[1].x - minX + px0.y
                );
            }
        } else {
            ctx.moveTo(datas[0].x - minX + px0.x, datas[1].x - minX + px0.y);
            ctx.quadraticCurveTo(
                datas[3].x - minX + px1.x, datas[4].x - minX + px1.y,
                datas[6].x - minX + px2.x, datas[7].x - minX + px2.y
            );

            if (false) {
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(datas[0].y - minY + py0.x, datas[1].y - minY + py0.y);

            } else {
                ctx.lineTo(datas[0].y - minY + py0.x, datas[1].y - minY + py0.y);
            }

            ctx.quadraticCurveTo(
                datas[3].y - minY + py1.x, datas[4].y - minY + py1.y,
                datas[6].y - minY + py2.x, datas[7].y - minY + py2.y
            )
        }

        ctx.stroke();
        ctx.fill();
        ctx.scale(1, 1);
        ctx.translate(-150 * this.ratio, -160 * this.ratio);
        ctx.restore();

        ctx.filter = "none";

        ctx.restore();
    }

    drawSign() {
        const ctx = this.ctx,
            datas = this.datas;

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.fillStyle = "rgba(20, 120, 220, 0.288)";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.translate(0.5, 0.5);
        datas.forEach((o, i) => {
            if (i === 0) {
                ctx.moveTo(o.x, o.y);
            } else {
                ctx.lineTo(o.x, o.y);
            }
            // ctx.fillRect(o.x, o.y, 1, 1);
        });
        ctx.stroke();
    }

    getPoint(angle, radius) {
        const radians = angle / 180 * Math.PI;
        return {
            x: Math.cos(radians) * radius,
            y: Math.sin(radians) * radius
        }
    }

    save() {
        const data = this.ctx.canvas.toDataURL("image/png");
        const a = document.createElement("A");
        a.href = data;
        a.download = "sculpture-" + new Date().getTime();
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    release() {
        this.canLoop = false;
    }
}