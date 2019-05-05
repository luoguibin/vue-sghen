import MapCenter from "./map-center";
import OrderCenter from "./order-center";
import GameWS from "./game-ws";
import {
    newSpriteCanvas,
    addSprites
} from "./utils";
import ViewControl from "./view-control";

class GameMain {

    width = 1024;
    height = 768;

    isInit = false;

    myModel = null;
    modelMap = {};
    mixerMap = {};
    meshObject = new THREE.Object3D();

    sTargetId = 0;

    constructor() {
        window.game = this;
    }

    init(data) {
        MapCenter.loadMapData(data.mapId)
            .then(mesh2es => {
                this._newPlayer(data, model => {
                    const object = this.meshObject;
                    mesh2es.forEach(meshes => {
                        meshes.forEach(mesh => {
                            object.add(mesh);
                        });
                    });
                    const scene = this._initSRC();
                    scene.add(model);
                    scene.add(object);

                    this.myModel = model;
                    this._initControls(model.position);
                    MapCenter.resetFloor(this.scene);

                    // const composer = new THREE.EffectComposer(this.renderer),
                    //     renderPass = new THREE.RenderPass(this.scene, this.camera),
                    //     outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
                    // composer.addPass(renderPass);
                    // composer.addPass(outlinePass);
                    // outlinePass.selectedObjects = [model];
                    // outlinePass.pulsePeriod = 5;
                    // outlinePass.renderToScreen = true;
                    // this.composer = composer;

                    this._start();
                });
            });
    }

    _start() {
        console.log("GameScene start()")
        this.isInit = true;
        this.clock = new THREE.Clock();
        this.stats = new Stats();
        this.animate = this.animate.bind(this);
        this.animate(0);
    }

    _initSRC() {
        let scene = this.scene;
        if (scene) {
            return scene;
        } else {
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0xa5a5a5, 20, 100);
        }
        this.scene = scene;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        this.renderer = renderer;

        const camera = new THREE.PerspectiveCamera(45);
        camera.position.set(0, 5, 20);
        this.camera = camera;

        // const gridHelper = new THREE.GridHelper(200, 100, 0x0000ff, 0x808080);
        // this.scene.add(gridHelper);
        // const axesHelper = new THREE.AxesHelper(100);
        // this.scene.add(axesHelper);
        return scene;
    }

    _initControls(position) {
        const viewControl = new ViewControl(this.camera);
        viewControl.setObjects(this.scene.children);
        viewControl.setPoint(this.myModel.position);
        viewControl.setCall(ViewControl.CALL_UP, (e, type) => {
            let object = e.object;
            if (type === 0) {
                GameWS.sendOrder({
                    order: 32000,
                    fromType: 10000,
                    fromId: this.myModel.userData.id,
                    data: e.point
                });
            } else {
                if (object.name === "floor") return;
                while (object.name !== "RootNode") {
                    object = object.parent;
                }
                if (object !== this.myModel) {
                    this.playerPanel.showPlayer(object.userData);
                    this.sTargetId = object.userData.id;
                } else {
                    this.sTargetId = 0;
                }
            }
        });
        this.viewControl = viewControl;
    }

    addPlayer(data) {
        if (!this.scene) {
            setTimeout(() => {
                this.addPlayer(data);
            }, 300);
            return;
        }
        if (data.id === this.myModel.userData.id)
            return;
        this.removePlayer(data.id);
        this._newPlayer(data, model => {
            this.scene.add(model);
        });
    }

    removePlayer(id) {
        if (id === this.myModel.userData.id)
            return;
        const model = this.modelMap[id];
        if (model) {
            this.mixerMap[id].stopAllAction();
            this.scene.remove(model);
            model.activeAction = null;
            model.actions = null;
            model.userData = null;
            if (model.moveTween) {
                model.moveTween.stop();
                model.moveTween = null;
            }
            delete this.modelMap[id];
            delete this.mixerMap[id];
        }
    }

    _newPlayer(data, call) {
        new THREE.GLTFLoader()
            .load("models/robot.glb", gltf => {
                const model = gltf.scene.children[0];
                model.userData = data;
                model.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                    }
                });
                this._addMixer(model, gltf.animations);

                const sphere = new THREE.SphereBufferGeometry(2, 16, 16),
                    material = new THREE.MeshBasicMaterial({
                        map: new THREE.CanvasTexture(this.newCanvas()),
                        transparent: true,
                        blending: THREE.AdditiveBlending
                    }),
                    mesh = new THREE.Mesh(sphere, material);
                material.opacity = 0.5;
                mesh.scale.y = 1.5;
                mesh.position.y = 2;
                const obj = { r: 0 };
                new TWEEN.Tween(obj)
                    .to({ r: Math.PI * 2 }, 5000)
                    .onUpdate(() => {
                        mesh.rotateY(Math.PI / 90);
                    })
                    .repeat(Infinity)
                    .start();
                model.add(mesh);
                addSprites(model, { x: 0, y: 2, z: 0, m: 3 });


                this.modelMap[data.id] = model;
                call(model);
            });
    }

    _addMixer(model, animations) {
        const states = ['Idle', 'Walking', 'WalkJump', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'],
            emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'],
            mixer = new THREE.AnimationMixer(model),
            actions = {};
        for (var i = 0; i < animations.length; i++) {
            const clip = animations[i],
                action = mixer.clipAction(clip);
            actions[clip.name] = action;
            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }

        let activeAction;
        if (model.userData.blood <= 0) {
            activeAction = actions['Death'];
        } else {
            activeAction = actions['Idle'];
        }
        activeAction.play();

        model.activeAction = activeAction;
        model.actions = actions;
        model.preRobotRotateY = 0;
        const userData = model.userData;
        model.position.set(userData.x, userData.y, userData.z);
        this.mixerMap[userData.id] = mixer;
    }

    /**
     * 
     * @param {THREE.Object3D} model 
     */
    showMeleeSkill(model) {
        for (let i = 0; i < 10; i++) {
            const material = new THREE.MeshLambertMaterial({
                map: new THREE.CanvasTexture(this.newCanvas()),
                blending: THREE.AdditiveBlending,
                opacity: 0.3
            }),
                geometry = new THREE.PlaneBufferGeometry(1, 1),
                mesh = new THREE.Mesh(geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.position.y = 0.01 * i + 1.3;
            model.add(mesh);

            new TWEEN.Tween(mesh.scale)
                .delay(Math.random() * 500)
                .to({ x: 20, y: 20 }, 1000)
                .onComplete(() => {
                    model.remove(mesh);
                })
                .start();
        }
    }

    /**
     * show damage
     * @param {*} id 
     * @param {*} damage 
     */
    showDamage(id, damage) {
        const model = this.modelMap[id];
        if (!model) return;

        const material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(this.newCanvasText(damage)),
            blending: THREE.AdditiveBlending
        }),
            sprite = new THREE.Sprite(material);
        sprite.position.y = 5;
        sprite.scale.x = 2.5;
        model.add(sprite);
        new TWEEN.Tween(sprite.position)
            .delay(200)
            .to({ x: 0, y: 6.5, z: 0 }, 2000)
            .onComplete(() => {
                model.remove(sprite);
            })
            .start();

        const userData = model.userData;
        userData.blood -= damage;
        if (userData.blood <= 0) {
            OrderCenter._actionMoveChange(model, "Death", 0.2);
        }
    }

    newCanvasText(damage, add) {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");
        ctx.font = "blod 20px Arial";
        const metrics = ctx.measureText(damage);
        canvas.width = 128;
        canvas.height = 32;
        ctx.fillStyle = add ? "#00ff00" : "#ff0000";
        ctx.fillText(damage, 0, 20);
        return canvas;
    }

    takeDrug(id, addBlood) {
        const model = this.modelMap[id];
        if (!model) return;

        const material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(this.newCanvasText(addBlood, true)),
            blending: THREE.AdditiveBlending
        }),
            sprite = new THREE.Sprite(material);
        sprite.position.y = 5;
        sprite.scale.x = 2.5;
        model.add(sprite);
        new TWEEN.Tween(sprite.position)
            .delay(200)
            .to({ x: 0, y: 6.5, z: 0 }, 2000)
            .onComplete(() => {
                model.remove(sprite);
            })
            .start();

        const userData = model.userData;
        userData.blood += addBlood;

        OrderCenter._actionMoveChange(model, "Idle", 0.2);
    }

    newCanvas(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width ? width : 128;
        canvas.height = height ? height : 128;
        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},0.7)`);
        gradient.addColorStop(0.5, `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},0.5)`);
        gradient.addColorStop(0.85, `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},0.7)`);
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }

    initDom(el, call) {
        if (!this.isInit) {
            if (!this.initCount) this.initCount = 0;
            this.initCount++;
            if (this.initCount > 20) {
                call(false);
                return;
            }
            setTimeout(() => {
                this.initDom(el, call);
            }, 300);
            return;
        }
        const width = el.clientWidth,
            height = el.clientHeight,
            renderer = this.renderer,
            camera = this.camera,
            domElement = renderer.domElement;

        renderer.setSize(width, height);
        if (domElement.parentElement) {
            domElement.remove();
        }
        el.appendChild(domElement);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        const statsEl = this.stats.domElement;
        if (statsEl.parentElement) {
            statsEl.remove();
        }
        el.appendChild(statsEl);

        this.width = width;
        this.height = height;
        // this.composer.setSize(width, height);

        call(true);
    }

    onRightClick(event) {
        const vector = new THREE.Vector3(),
            camera = this.camera,
            cPosition = camera.position;
        vector.set(
            (event.clientX / this.width) * 2 - 1,
            - (event.clientY / this.height) * 2 + 1,
            0.5);
        vector.unproject(camera);
        const raycaster = new THREE.Raycaster(cPosition, vector.sub(cPosition).normalize()),
            intersects = raycaster.intersectObjects([this.scene.getObjectByName("floor")]);
        if (intersects.length > 0) {
            GameWS.sendOrder({
                order: 32000,
                fromType: 10000,
                fromId: this.myModel.userData.id,
                data: intersects[0].point
            });
        }
    }


    animate(time) {
        this.isInit && requestAnimationFrame(this.animate);
        // this.isInit && setTimeout(this.animate, 1000 / 12);

        TWEEN.update();
        this.viewControl.update();
        this.stats.update();

        const delta = this.clock.getDelta(),
            o = this.mixerMap;
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                o[key].update(delta);
            }
        }

        // this.composer.render();
        this.renderer.render(this.scene, this.camera);
    }

    release() {
        this.isInit = false
    }
}

export default new GameMain();