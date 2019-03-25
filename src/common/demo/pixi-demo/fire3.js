import * as dat from 'dat.gui';

/**
 * 火焰效果
 */
class Fire {

    /**
     * 火焰粒子数
     */
    count = 0;
    countMax = 999;

    /**
     * 火焰更新的位置
     */
    position = {
        x: 150,
        y: 330
    };

    /**
     * 火焰行为控制参数
     */
    config = {
        scaleMin: 0.75,
        scaleMax: 1,
        alphaMin: 0.15,
        alphaMax: 1.4,
        // 粒子速度为base±range
        vxBase: 0,
        vxRange: 0.3,
        xRange: 0,
        vyBase: 1.35,
        vyRange: 2,
        yRange: 0,
        tint: 6850
    }

    /**
     * 构造函数
     * @param {PIXI.Application} app 
     */
    constructor(app) {
        window.fire3 = this;

        const container = new PIXI.particles.ParticleContainer(this.countMax, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        app.stage.addChild(container);


        this.app = app;
        this.container = container;

        this.img = this.newImage();
        this.setCount(60);
        this.initGUI();
    }

    initGUI() {
        const gui = new dat.GUI(),
            config = this.config;
        gui.add(config, "scaleMin", 0, 1).step(0.05);
        gui.add(config, "scaleMax", 0.5, 3).step(0.1);
        gui.add(config, "alphaMin", 0, 1).step(0.05);
        gui.add(config, "alphaMax", 0.2, 3).step(0.1);
        gui.add(config, "vxBase", -15, 15).step(0.05);
        gui.add(config, "vxRange", 0, 10).step(0.05);
        gui.add(config, "xRange", 0, 300);
        gui.add(config, "vyBase", -15, 15).step(0.05);
        gui.add(config, "vyRange", 0, 10).step(0.05);
        gui.add(config, "tint", 0, 0xffffff).step(10000);

        const el = gui.domElement,
            style = el.style;
        style.position = "absolute";
        style.top = 0;
        style.left = 0;
        style.zIndex = 100;
        document.body.appendChild(el);

        const button = document.createElement("BUTTON");
        button.innerHTML = "udpate";
        button.onclick = () => {
            this.resetDudes();
        };
        el.insertBefore(button, el.lastElementChild);

        this.gui = gui;
    }

    /**
     * 设置粒子个数
     * @param {Number} count 
     */
    setCount(count) {
        if (count < 10 || count > this.countMax) return;

        const container = this.container,
            preCount = this.count;
        this.count = count;
        if (count < preCount) {
            for (let i = preCount - 1; i >= count; i--) {
                container.removeChildAt(i);
            }
        } else {
            const img = this.img;
            count = count - preCount;
            for (let i = 0; i < count; i++) {
                const dude = PIXI.Sprite.from(img);
                dude.anchor.set(0.5);

                this.resetDude(dude, i);
                container.addChild(dude);
            }
        }
        this.resetDudes();
    }

    /**
     * 设置粒子颜色渐变
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    setColor(r, g, b, a) {
        const img = this.newImage(r, g, b, a),
            texture = PIXI.Texture.from(img);

        const children = this.container.children;
        children.forEach(child => {
            child.texture = texture;
        });
        this.img = img;
    }

    /**
     * 强制更新参数
     */
    resetDudes() {
        this.container.children.forEach((dude, index) => {
            this.resetDude(dude, index);
        });
    }

    /**
     * 重置火焰的控制参数
     * @param {PIXI.Sprite} dude 
     * @param {Number} index 
     */
    resetDude(dude, index) {
        const config = this.config,
            position = this.position;

        const sign = Math.random() > 0.5 ? 1 : -1;
        dude.x = position.x + sign * Math.random() * config.xRange;
        dude.y = position.y;

        if (!dude.fixed) {
            dude.vx = config.vxBase - (0.5 - Math.random()) * config.vxRange;
            dude.vy = config.vyBase - (0.5 - Math.random()) * config.vyRange;
        }

        dude.scale.set(config.scaleMax, config.scaleMax);
        dude.alpha = config.alphaMax;

        if (index !== undefined) {
            if (index >= this.count - 5) {
                dude.vx = 0;
                dude.vy = 0;
                dude.y -= 50;
                dude.scaleStep = 0;
                dude.scale = 0.8;
                dude.alphaStep = 0;
                dude.alpha = 0.5;
                dude.tint = config.tint;
                dude.fixed = true;
                return;
            } else {
                dude.x -= dude.vx * index;
                dude.y -= dude.vy * index;
            }

            dude.scaleStep = (config.scaleMax - config.scaleMin) / this.count;
            const curScale = config.scaleMax - dude.scaleStep * index;
            dude.scale.set(curScale, curScale);

            dude.alphaStep = dude.scaleStep;
            dude.alpha -= dude.alphaStep * index;
        }
    }


    /**
     * 设置粒子位置
     * @param {Number} x 
     * @param {Number} y 
     */
    setPosition(x, y) {
        this.position.x = x || 200;
        this.position.y = y || 200;
    }

    /**
     * 绘制火焰粒子位图
     * @param {CanvasRenderingContext2D} ctx0
     */
    newImage(r, g, b, a, ctx0) {
        if (!r) {
            r = 210;
            g = 100;
            b = 33;
            a = 0.4;
        }
        const width = 100, height = width;
        const canvas = document.createElement("CANVAS");
        canvas.setAttribute("width", width + "px");
        canvas.setAttribute("height", height + "px");

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(width / 2, height * 0.5, 0, width / 2, height * 0.5, width / 2);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        return canvas;
    }

    /**
     * 更新火焰的一帧
     * @param {Number} tick 
     */
    update(tick) {
        const config = this.config,
            children = this.container.children,
            len = children.length;

        for (let i = 0; i < len; i++) {
            const dude = children[i];
            dude.x -= dude.vx;
            dude.y -= dude.vy;

            let scale = dude.scale.x;
            scale -= dude.scaleStep;
            dude.scale.set(scale, scale);

            dude.alpha -= dude.alphaStep;

            // 当透明度或缩放值小于对应值时重新更新控制参数
            if (dude.alpha < config.alphaMin || scale < config.scaleMin) {
                this.resetDude(dude);
            }
        }
    }

    release() {
        if (this.gui) {
            this.gui.domElement.remove();
        }
    }
}

export default Fire;