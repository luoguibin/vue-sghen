import PathF from "pathfinding";

class MapManager {

    mapId = -1;
    meshes = [];

    width = 200;
    height = 200;
    hUnit = 0.5;
    mapMatrix = [];

    constructor() {
    }

    loadMapData(mapId) {
        this.mapId = mapId;

        const promises = [this._initLights(), this._initMeadow()];
        if (mapId === 0) {
            promises.push(this._initTree());
            setTimeout(() => {
                const hWidth = this.width / 2,
                    hHeight = this.height / 2,
                    mapMatrix = [];
                for (let j = 0; j < this.height; j++) {
                    const arr = [];
                    for (let i = 0; i < this.width; i++) {
                        arr.push(0);
                    }
                    mapMatrix.push(arr);
                }
                this.mapMatrix = mapMatrix;
                MapTreeInfos.forEach(o => {
                    const i = Math.floor(o.x + hWidth),
                        j = Math.floor(o.z + hHeight);
                    mapMatrix[j][i] = 1;
                    if (i - 1 >= 0) {
                        mapMatrix[j][i - 1] = 1;
                    }
                    if (i + 1 < this.width) {
                        mapMatrix[j][i + 1] = 1;
                    }
                    if (j - 1 >= 0) {
                        mapMatrix[j - 1][i] = 1;
                        if (i - 1 >= 0) {
                            mapMatrix[j - 1][i - 1] = 1;
                        }
                        if (i + 1 < this.width) {
                            mapMatrix[j - 1][i + 1] = 1;
                        }
                    }
                    if (j + 1 < this.height) {
                        mapMatrix[j + 1][i] = 1;
                        if (i - 1 >= 0) {
                            mapMatrix[j + 1][i - 1] = 1;
                        }
                        if (i + 1 < this.width) {
                            mapMatrix[j + 1][i + 1] = 1;
                        }
                    }
                });
            }, 0);
        }
        return Promise.all(promises);
    }

    resetFloor(scene) {
        this.floor = scene.getObjectByName("floor");
    }

    _initLights() {
        return new Promise(function (resolve, reject) {
            const sunLight = new THREE.DirectionalLight(0x999999),
                shadow = sunLight.shadow,
                camera = shadow.camera;

            sunLight.name = "sunLight";
            sunLight.castShadow = false || 0;
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

            const meshes = [];
            meshes.push(new THREE.AmbientLight(0x222222));
            meshes.push(sunLight);

            // const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 0.1);
            // meshes.push(sunLightHelper);

            // const cameraHelper = new THREE.CameraHelper(sunLight.shadow.camera);
            // meshes.push(cameraHelper);
            resolve(meshes);
        });
    }

    _initMeadow() {
        return new Promise(function (resolve, reject) {
            const textureLoader = new THREE.TextureLoader(),
                planeMap = textureLoader.load(require("@/assets/textures/meadow.jpeg"));
            planeMap.repeat.set(25, 25);
            planeMap.wrapS = THREE.RepeatWrapping;
            planeMap.wrapT = THREE.RepeatWrapping;

            const geometry = new THREE.PlaneBufferGeometry(200, 200, 200, 200),
                material = new THREE.MeshLambertMaterial({ map: planeMap }),
                mesh = new THREE.Mesh(geometry, material);
            material.metalness = 0;
            mesh.rotateX(-Math.PI / 2);
            mesh.receiveShadow = false || 0;
            mesh.position.y = -0.01;
            mesh.name = "floor";
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            // test z 0
            const vertices = geometry.attributes.position.array;
            let val = 0, unit = 0.2, count = 0;
            for (let l = vertices.length, i = 0; i < l; i += 3) {
                count++;
                if (count >= 300) {
                    count = 0;
                    val += unit;
                    if (val > 3) unit = -unit;
                    else if (val < 0) {
                        val = unit;
                        unit = -unit;
                    }
                }
                vertices[i + 2] = val;
            }
            // test z 1
            // const middle = Math.floor(vertices.length / 3 / 2);
            // const lineOffset = 3 * 200 + 3;
            // for (let i = 0; i <= 20; i++) {
            //     vertices[middle * 3 + 2 + i * lineOffset] = 1.88;
            //     vertices[middle * 3 + 5 + i * lineOffset] = 1.28;
            //     vertices[middle * 3 + 8 + i * lineOffset] = 0.88;
            //     vertices[middle * 3 + 11 + i * lineOffset] = 0.48;
            //     vertices[middle * 3 + 14 + i * lineOffset] = 0.28;
            // }

            geometry.computeVertexNormals();

            resolve([mesh]);
        });

    }

    _initTree(call) {
        return new Promise(function (resolve, reject) {
            new THREE.GLTFLoader()
                .load('models/flow-tree/scene.gltf', gltf => {
                    // window.treeScene = gltf.scene;
                    const parent = gltf.scene.children[0].children[0].children[0].children[0].children[0],
                        mesh = parent.children[0];
                    parent.children = [];

                    mesh.material.lightMapIntensity = 0.3;

                    const meshes = [];

                    MapTreeInfos.forEach(o => {
                        const mesh_ = new THREE.Mesh(mesh.geometry, mesh.material);
                        mesh_.castShadow = false || 0;
                        mesh_.position.set(o.x, 0, o.z);
                        mesh_.rotateY(o.m);
                        mesh_.matrixAutoUpdate = false;
                        mesh_.updateMatrix();
                        meshes.push(mesh_);
                    });
                    resolve(meshes);
                });
        });
    }

    findPath(fromPoint, toPoint) {
        const hWidth = this.width / 2,
            hHeight = this.height / 2;
        const fromX = Math.floor(fromPoint.x + hWidth),
            fromZ = Math.floor(fromPoint.z + hHeight),
            toX = Math.floor(toPoint.x + hWidth),
            toZ = Math.floor(toPoint.z + hHeight);
        if (fromX === toX && fromZ === toZ) {
            return [new THREE.Vector3().copy(toPoint)];
        }

        const grid = new PathF.Grid(this.mapMatrix),
            finder = new PathF.AStarFinder({
                heuristic: PathF.Heuristic.octile,
                allowDiagonal: true,
                dontCrossCorners: true
            }),
            path = finder.findPath(fromX, fromZ, toX, toZ, grid);
        if (path.length === 0) return [];
            
        // const newPath = PathF.Util.compressPath(path),
        const newPath = PathF.Util.smoothenPath(grid, path),
            hUnit = this.hUnit,
            pointArray = [];
        newPath.forEach((point, i) => {
            if (i > 0) {
                pointArray.push(
                    new THREE.Vector3(
                        point[0] - hWidth + hUnit,
                        0,
                        point[1] - hHeight + hUnit
                    )
                );
            }
        });

        if (pointArray.length > 0) {
            // reset the last point to its reality
            const lastPoint = pointArray[pointArray.length - 1];
            lastPoint.copy(toPoint);
        }
        return pointArray;
    }

    updateWalkingHeight(position) {
        const floor = this.floor;
        if (!floor) return;
        const w = this.width,
            h = this.height;
        // floor geometry array 从二维坐标轴(y↑→x)第三象限开始,依次→↓排序
        const x = Math.floor(position.x + w / 2),
            z = Math.floor(position.z + h / 2),
            i = ((w + 1) * z + x) * 3, // w个格子共有(w+1)个点
            i2 = i + (w + 1) * 3,
            vertices = floor.geometry.attributes.position.array;
        // console.log(x, z, i, i2);
        // console.log(vertices.slice(i, i + 6), vertices.slice(i2, i2 + 6));
        // return 0;
        // floor是通过旋转-90后作为地面,故z轴为水平高度
        const x0 = vertices[i],
            // y0 = vertices[i + 1],
            z0 = vertices[i + 2],
            // x1 = vertices[i + 3],
            // y1 = vertices[i + 4],
            z1 = vertices[i + 5],
            // x2 = vertices[i2],
            // y2 = vertices[i2 + 1],
            z2 = vertices[i2 + 2],
            // x3 = vertices[i2 + 3],
            // y3 = vertices[i2 + 4],
            z3 = vertices[i2 + 5];

        const nZ = position.z - Math.floor(position.z),
            nX = position.x - Math.floor(position.x);
        // 标记是否为左上角的三角形
        let ltFlag = nX === 0;
        if (!ltFlag) {
            ltFlag = 1 - nZ > nX;
        }
        // console.log("\n" + ltFlag, nX, nZ);
        // 基于左下角为基准
        let y = z2;
        if (ltFlag) {
            const y02 = z0 - z2,
                y10 = z1 - z0;
            y += (1 - nZ) * y02;
            y += nX * y10;
            // console.log(y02, y10, y);
        } else {
            const y32 = z3 - z2,
                y13 = z1 - z3;
            y += nX * y32;
            y += (1 - nZ) * y13;
            // console.log(y32, y13, y);
        }
        // console.log(y)
        position.y = y;
        return y;
    }

    release() {
    }
}

export default new MapManager();

// 地图信息应从服务器中拉取一份本地保存

const MapTreeInfos = [
    {
        "x": 79,
        "y": 0,
        "z": 97,
        "m": 3.0262874433162583
    },
    {
        "x": -53,
        "y": 0,
        "z": 43,
        "m": 3.9550924477937786
    },
    {
        "x": 81,
        "y": 0,
        "z": 46,
        "m": 4.825417220741223
    },
    {
        "x": -67,
        "y": 0,
        "z": -5,
        "m": 0.4889757775044887
    },
    {
        "x": 71,
        "y": 0,
        "z": -40,
        "m": 6.066239261056998
    },
    {
        "x": -65,
        "y": 0,
        "z": 97,
        "m": 1.4353044108774504
    },
    {
        "x": -68,
        "y": 0,
        "z": 52,
        "m": 1.5439835887329043
    },
    {
        "x": 8,
        "y": 0,
        "z": -83,
        "m": 2.611916687331676
    },
    {
        "x": 18,
        "y": 0,
        "z": 25,
        "m": 4.976598977745064
    },
    {
        "x": 81,
        "y": 0,
        "z": -21,
        "m": 1.6698484731633394
    },
    {
        "x": -70,
        "y": 0,
        "z": -11,
        "m": 4.1686449920545705
    },
    {
        "x": 56,
        "y": 0,
        "z": -75,
        "m": 2.867349802806153
    },
    {
        "x": 39,
        "y": 0,
        "z": -53,
        "m": 5.7144239742167935
    },
    {
        "x": -99,
        "y": 0,
        "z": 66,
        "m": 5.668236581942143
    },
    {
        "x": 73,
        "y": 0,
        "z": 44,
        "m": 0.4907246442871901
    },
    {
        "x": -7,
        "y": 0,
        "z": 10,
        "m": 2.648720897881686
    },
    {
        "x": -52,
        "y": 0,
        "z": 67,
        "m": 2.13795510397227
    },
    {
        "x": 4,
        "y": 0,
        "z": 81,
        "m": 3.8516309787270098
    },
    {
        "x": -41,
        "y": 0,
        "z": 57,
        "m": 2.310278500579051
    },
    {
        "x": -41,
        "y": 0,
        "z": -13,
        "m": 2.5592438111027334
    },
    {
        "x": 54,
        "y": 0,
        "z": 65,
        "m": 0.9784992970498049
    },
    {
        "x": -48,
        "y": 0,
        "z": 2,
        "m": 0.674410070265564
    },
    {
        "x": 47,
        "y": 0,
        "z": -78,
        "m": 0.8301445717612068
    },
    {
        "x": 88,
        "y": 0,
        "z": -54,
        "m": 0.3853460391616845
    },
    {
        "x": -63,
        "y": 0,
        "z": -95,
        "m": 5.825280902008106
    },
    {
        "x": 40,
        "y": 0,
        "z": -45,
        "m": 1.2738677269986602
    },
    {
        "x": -66,
        "y": 0,
        "z": 38,
        "m": 0.09827823430721302
    },
    {
        "x": 12,
        "y": 0,
        "z": -100,
        "m": 3.8656145338978343
    },
    {
        "x": -30,
        "y": 0,
        "z": 76,
        "m": 2.952213564511282
    },
    {
        "x": 41,
        "y": 0,
        "z": -16,
        "m": 2.0057195421264606
    },
    {
        "x": -85,
        "y": 0,
        "z": -60,
        "m": 3.8299507068514425
    },
    {
        "x": -61,
        "y": 0,
        "z": 80,
        "m": 2.2426975541572864
    },
    {
        "x": -7,
        "y": 0,
        "z": -28,
        "m": 3.8511655640616937
    },
    {
        "x": -78,
        "y": 0,
        "z": 99,
        "m": 6.143632759869905
    },
    {
        "x": 85,
        "y": 0,
        "z": -55,
        "m": 1.390972553654363
    },
    {
        "x": 6,
        "y": 0,
        "z": 52,
        "m": 0.3568656997464948
    },
    {
        "x": 76,
        "y": 0,
        "z": 99,
        "m": 3.8820117408288835
    },
    {
        "x": 78,
        "y": 0,
        "z": -55,
        "m": 3.6111066307924546
    },
    {
        "x": 0,
        "y": 0,
        "z": 38,
        "m": 2.2548837043476064
    },
    {
        "x": -8,
        "y": 0,
        "z": -66,
        "m": 2.948699253186756
    },
    {
        "x": 33,
        "y": 0,
        "z": 18,
        "m": 0.6969686463418031
    },
    {
        "x": 45,
        "y": 0,
        "z": 19,
        "m": 6.1672807849942535
    },
    {
        "x": -95,
        "y": 0,
        "z": -47,
        "m": 5.111043842873603
    },
    {
        "x": 22,
        "y": 0,
        "z": -6,
        "m": 4.10051099563009
    },
    {
        "x": 11,
        "y": 0,
        "z": 64,
        "m": 1.6989256141394813
    },
    {
        "x": -19,
        "y": 0,
        "z": -61,
        "m": 5.439370910522885
    },
    {
        "x": -19,
        "y": 0,
        "z": 16,
        "m": 4.878561891196547
    },
    {
        "x": 4,
        "y": 0,
        "z": -70,
        "m": 1.9511182645067788
    },
    {
        "x": -7,
        "y": 0,
        "z": 4,
        "m": 0.2536697260550226
    },
    {
        "x": -99,
        "y": 0,
        "z": -53,
        "m": 0.27386064805357374
    }
] 