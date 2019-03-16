import * as dat from 'dat.gui';

class Fire {

    maggots = [];

    /**
     * 火焰更新的位置
     */
    position = {
        x: 200,
        y: 200
    };

    baffle = {
        x: 200,
        y: 200,
        width: 200,
        height: 50
    };

    config = {
        scale: 1,
        scaleStep: -2.2,
        alpha: 1.5,
        alphaStep: -1.8,
        vx: 0,
        vxStep: 0.7,
        vy: 5,
        vyStep: 1.5,
        tint: 0xffffff
    }

    /**
     * 构造函数
     * @param {PIXI.Application} app 
     */
    constructor(app) {
        const rectangle = new PIXI.Graphics(),
            baffle = this.baffle;
        rectangle.beginFill(0xff333333);
        rectangle.lineStyle(4, 0xFF3300, 1);
        rectangle.drawRect(0, 0, baffle.width, baffle.height);
        rectangle.endFill();
        rectangle.x = baffle.x;
        rectangle.y = baffle.y;
        app.stage.addChild(rectangle);

        const sprites = new PIXI.particles.ParticleContainer(1000, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        app.stage.addChild(sprites);

        this.app = app;
        this.sprites = sprites;

        this.init();
        this.initGUI();
    }

    init() {
        const img = this.newImage();
        const sprites = this.sprites,
            maggots = this.maggots,
            totalSprites = 188;

        for (let i = 0; i < totalSprites; i++) {
            const dude = PIXI.Sprite.from(img);
            dude.anchor.set(0.5);

            this.resetDude(dude);
            maggots.push(dude);
            sprites.addChild(dude);
        }
    }

    initGUI() {
        const gui = new dat.GUI(),
            config = this.config;
        gui.add(config, "scale", 0.2, 2);
        gui.add(config, "scaleStep", -5, -0.1);
        gui.add(config, "alpha", 0.5, 2);
        gui.add(config, "alphaStep", -5, -0.1);
        gui.add(config, "vx", 0, 10);
        gui.add(config, "vxStep", -5, 5);
        gui.add(config, "vy", -10, 10);
        gui.add(config, "vyStep", -5, 5);
        gui.add(config, "tint", 0x000000, 0xffffff);

        const el = gui.domElement,
            style = el.style;
        style.position = "absolute";
        style.top = 0;
        style.left = 0;
        style.zIndex = 100;
        document.body.appendChild(el);
    }

    resetDude(dude) {
        const config = this.config;

        const scale = config.scale;
        dude.scale.set(scale, scale);
        dude.scaleStep = (config.scaleStep + Math.random() * config.scaleStep) / 100;

        const position = this.position;
        let flag = Math.random() > 0.5 ? 1 : -1;
        dude.x = position.x + flag * Math.random() * 5;
        dude.y = position.y;

        if (Math.random() < 0.5) {
            dude.vx = (config.vx + Math.random() * config.vxStep);
        } else {
            dude.vx = -(config.vx + Math.random() * config.vxStep);
        }

        if (Math.random() < 0.5) {
            dude.vy = -(config.vy + Math.random() * config.vyStep);
        } else {
            dude.vy = -(config.vy + Math.random() * config.vyStep);
        }

        dude.alpha = config.alpha;
        dude.alphaStep = (config.alphaStep + Math.random() * config.alphaStep) / 100;

        dude.tint = config.tint;
    }

    setPosition(x, y) {
        this.position.x = x || 200;
        this.position.y = y || 200;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx0
     */
    newImage(ctx0) {
        const width = 100, height = width;
        const canvas = document.createElement("CANVAS");
        canvas.setAttribute("width", width + "px");
        canvas.setAttribute("height", height + "px");

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(width / 2, height * 0.8, 0, width / 2, height * 0.5, width / 2);
        gradient.addColorStop(0, "rgba(210, 100, 33, 0.6)");
        gradient.addColorStop(0.1, "rgba(210, 100, 33, 0.5)");
        gradient.addColorStop(0.7, "rgba(210, 33, 33, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        return canvas;
    }

    checkBaffle(dude) {
        const baffle = this.baffle;
        if (dude.x > baffle.x && dude.x < baffle.x + baffle.width) {
            if (Math.abs(dude.y - (baffle.y + baffle.height)) < 10) {
                dude.y = baffle.y + baffle.height;
            }
        }
    }

    update(tick) {
        const maggots = this.maggots,
            len = maggots.length;

        for (let i = 0; i < len; i++) {
            const dude = maggots[i];            
            dude.x += dude.vx;
            dude.y += dude.vy;

            this.checkBaffle(dude);

            let scale = dude.scale.x;
            scale += dude.scaleStep;
            dude.scale.set(scale, scale);

            dude.alpha += dude.alphaStep;

            if (dude.alpha < 0 || scale < 0) {
                this.resetDude(dude);
            }

        }
    }
}

export default Fire;