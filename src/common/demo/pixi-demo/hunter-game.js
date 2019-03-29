import Fire from "./fire";
import Fire3 from "./fire3";

class HunterGame {

    app = null;
    direction = "";
    fire = null;
    fire3 = null;

    rPoints = [];
    strip = null;

    /**
     * constructor
     * @param {Vue} vueEl 
     */
    constructor(vueEl) {
        this.vueEl = vueEl;
        this.initPixi();
        this.initEvents();

        window.cheLab = this;
    }

    initPixi() {
        let type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        const app = new PIXI.Application({
            width: 512,         // default: 800
            height: 512,        // default: 600
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1 
        });

        const style = app.view.style;
        style.position = "relative";
        style.top = "50%";
        style.left = "50%";
        style.transform = "translate(-50%, -50%)";

        this.vueEl.$el.appendChild(app.view);
        this.app = app;

        this.hunter = "static/textures/hunter.json";
        PIXI.Loader.shared.add(this.hunter).load((loader, resources) => {
            this.initSprites(loader, resources);
        });
    }

    initSprites(loader, resources) {
        const textures = resources[this.hunter].textures,
            app = this.app;

        const dungeon = new PIXI.Sprite(textures["dungeon.png"]);
        app.stage.addChild(dungeon);

        const door = new PIXI.Sprite(textures["door.png"]);
        door.position.set(32, 0);
        app.stage.addChild(door);

        const treasure = new PIXI.Sprite(textures["treasure.png"]);
        treasure.x = 300;
        treasure.y = 400;
        treasure.name = "treasure";
        app.stage.addChild(treasure);

        const numberOfBlobs = 6,
            spacing = 48,
            xOffset = 150;

        for (let i = 0; i < numberOfBlobs; i++) {
            const blob = new PIXI.Sprite(textures["blob.png"]);
            const x = spacing * i + xOffset,
                y = this.randomInt(0, app.stage.height - blob.height);
            blob.x = x;
            blob.y = y;
            blob.name = "blob-" + i;
            app.stage.addChild(blob);
        }

        this.fire = new Fire(app);
        this.fire3 = new Fire3(app);

        const explorer = new PIXI.Sprite(textures["explorer.png"]);
        explorer.position.set(32 * 2, 16 * 12);
        explorer.anchor.set(0.5);
        explorer.v = 2;
        explorer.name = "explorer";
        explorer.interactive = true;
        explorer.buttonMode = true;

        explorer.on('pointerdown', e => {
            explorer.on('pointermove', this.onMove);
        });
        explorer.on('pointerup', e => {
            explorer.off('pointermove', this.onMove);
        })
        this.onMove = e => {
            const newPosition = e.data.getLocalPosition(explorer.parent);
            explorer.position.set(newPosition.x, newPosition.y);
        }

        app.stage.addChild(explorer);

        const rPoints = this.rPoints;
        this.ropeLength = 406 / 10;
        for (let i = 0; i < 10; i++) {
            rPoints.push(new PIXI.Point(i * this.ropeLength, 0));
        }

        const imgUrl = require("@/assets/img/fire-02.png");
        const strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage(imgUrl), rPoints);
        // strip.rotation = -Math.PI / 2;
        // strip.pivot.set(200, 203);
        strip.x = 300;
        strip.y = 400;

        app.stage.addChild(strip);
        this.strip = strip;

        const g = new PIXI.Graphics();
        g.x = strip.x;
        g.y = strip.y;
        app.stage.addChild(g);
        this.g = g;

        this.gameLoop = this.gameLoop.bind(this);
        this.app.ticker.add(this.gameLoop);
    }

    initEvents() {
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);

        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }

    _onKeyDown(e) {
        switch (e.keyCode) {
            case 37:
                this.direction = "left";
                break;
            case 38:
                this.direction = "up";
                break;
            case 39:
                this.direction = "right";
                break;
            case 40:
                this.direction = "down";
                break;
        }
    }

    _onKeyUp(e) {
        switch (e.keyCode) {
            case 37:
                this.direction = "";
                break;
            case 38:
                this.direction = "";
                break;
            case 39:
                this.direction = "";
                break;
            case 40:
                this.direction = "";
                break;
        }
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    gameLoop(delta) {
        const stage = this.app.stage,
            explorer = stage.getChildByName("explorer"),
            children = stage.children;

        switch (this.direction) {
            case "left":
                explorer.x -= explorer.v;
                break;
            case "up":
                explorer.y -= explorer.v;
                break;
            case "right":
                explorer.x += explorer.v;
                break;
            case "down":
                explorer.y += explorer.v;
                break;
        }
        this.fire.setPosition(explorer.x, explorer.y);
        this.fire.update(delta);

        this.fire3.update(delta);

        const rPoints = this.rPoints,
            ropeLength = this.ropeLength;
        for (let i = 1; i < rPoints.length; i++) {
            rPoints[i].y = -(i * ropeLength + Math.random() * 10);
            rPoints[i].x = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
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

    release() {
        this.fire3.release();
        this.app.ticker.remove(this.gameLoop);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }
}

export default HunterGame;