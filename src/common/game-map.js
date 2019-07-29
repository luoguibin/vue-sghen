class MapManager {

    mapId = -1;
    mPlayer = null;
    objectMap = {};
    mixerMap = {};

    constructor() {
        console.log("MapManager constructor")
        window.gameMap = this;
    }

    loadMapData(scene, mapId) {
        if (!scene || mapId === undefined) return;
        this.clearMapData(scene);

        // create the base scene models for all the map
        if (this.mapId === -1) {
            this._initLights(scene);
            this._initMeadow(scene);
        }

        this.mapId = mapId;
        // create the map scene models
        if (mapId === 0) {
            this.initTree(scene);
        }
    }

    clearMapData(scene) {
        if (this.mapId === -1) return;

        const objectMap = this.objectMap,
            mId = this.mPlayer.gameData.id;
        for (const key in objectMap) {
            if (objectMap.hasOwnProperty(key)) {
                if (key === mId) continue;
                scene.remove(objectMap[key]);
            }
        }
        this.objectMap = {};
    }

    _initLights(scene) {
        scene.add(new THREE.AmbientLight(0x222222));

        const sunLight = new THREE.DirectionalLight(0x999999),
            shadow = sunLight.shadow,
            camera = shadow.camera;

        sunLight.name = "sunLight";
        sunLight.castShadow = true;
        shadow.mapSize.width = 2000;
        shadow.mapSize.height = 2000;
        camera.near = 0.1;
        camera.far = 300;
        camera.top = 100;
        camera.bottom = -100;
        camera.right = 100;
        camera.left = -100;

        const position = sunLight.position,
            radians = { v: -Math.PI / 2 };
        position.set(0, 100, 0);
        // new TWEEN.Tween(radians)
        //     .to({ v: Math.PI * 4 / 3 }, 20 * 1000)
        //     .repeat(Infinity)
        //     .onUpdate(() => {
        //         position.set(Math.sin(radians.v) * 100, Math.cos(radians.v) * 100, 0);
        //     })
        //     .start();

        scene.add(sunLight);

        // const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 0.1);
        // scene.add(sunLightHelper);

        // const cameraHelper = new THREE.CameraHelper(sunLight.shadow.camera);
        // scene.add(cameraHelper);
    }

    _initMeadow(scene) {
        const textureLoader = new THREE.TextureLoader(),
            planeMap = textureLoader.load(require("@/assets/textures/grass.png"));
        planeMap.repeat.set(25, 25);
        planeMap.wrapS = THREE.RepeatWrapping;
        planeMap.wrapT = THREE.RepeatWrapping;

        const geometry = new THREE.PlaneBufferGeometry(200, 200, 1, 1),
            material = new THREE.MeshLambertMaterial({ map: planeMap }),
            mesh = new THREE.Mesh(geometry, material);
        material.metalness = 0;
        mesh.rotateX(-Math.PI / 2);
        mesh.receiveShadow = true;
        mesh.position.y = -0.01;
        mesh.name = "floor";

        scene.add(mesh);
    }

    initTree(scene) {
        const loader = new THREE.GLTFLoader();
        loader.load('models/flow-tree/scene.gltf', gltf => {
            window.treeScene = gltf.scene;
            const parent = gltf.scene.children[0].children[0].children[0].children[0].children[0],
                mesh = parent.children[0],
                objectMap = this.objectMap;
            parent.children = [];

            mesh.material.lightMapIntensity = 0.3;
            for (let i = 1; i <= 50; i++) {
                const mesh_ = new THREE.Mesh(mesh.geometry, mesh.material);
                mesh_.castShadow = true;
                mesh_.position.set(THREE.Math.randInt(-100, 100), 0, THREE.Math.randInt(-100, 100));
                mesh_.rotateY(Math.random() * Math.PI * 2);
                scene.add(mesh_);
                objectMap[mesh_.id] = mesh_;
            }
        });
    }

    addPlayer(scene, model, isSelf) {
        if (isSelf) {
            this.mPlayer = model;
        } else {
            this.removePlayerById(scene, model.gameData.id);
        }
        const states = ['Idle', 'Walking', 'WalkJump', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'],
            emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'],
            animations = model.animations,
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
        const activeAction = actions['Idle'];
        activeAction.play();

        model.animations = undefined;
        model.actions = actions;
        model.activeAction = activeAction;
        model.position.set(model.gameData.x, model.gameData.y, model.gameData.z);
        model.preRobotRotateY = 0;
        scene.add(model);
        this.objectMap[model.gameData.id] = model;
        this.mixerMap[model.gameData.id] = mixer;
    }
    removePlayer(scene, model) {
        this.mixerMap[model.gameData.id].stopAllAction();
        model.activeAction = null;
        model.actions = null;

        scene.remove(model);
        delete this.objectMap[model.gameData.id];
        delete this.mixerMap[model.gameData.id];
        model.gameData = null;
    }
    removePlayerById(scene, id) {
        const model = this.objectMap[id];
        if (model) this.removePlayer(scene, model);
    }

    release() {
        this.clearMapData();
        this.objectMap = null;
        this.mixerMap = null;
        this.mPlayer = null;
    }
}

export default new MapManager()