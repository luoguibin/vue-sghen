class HunterGame {

    app = null;
    direction = "";

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

        const explorer = new PIXI.Sprite(textures["explorer.png"]);
        explorer.position.set(32, 16);
        explorer.v = 2;
        explorer.name = "explorer";
        app.stage.addChild(explorer);

        this.gameLoop = this.gameLoop.bind(this);
        app.ticker.add(this.gameLoop);
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
    }

    release() {
        this.app.ticker.remove(this.gameLoop);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }
}

export default HunterGame;