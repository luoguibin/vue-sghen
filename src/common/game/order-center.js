import GameScene from "./game-scene";
import MapCenter from "./map-center";

class GameOrder {

    dealOrder(order) {
        console.log(order);

        const type = order.order;
        switch (type - type % 10000) {
            case 10000:
                this._dealOrderMsg(order);
                break;
            case 20000:
                this._dealSkillMsg(order)
                break;
            case 30000:
                this._dealOrderAction(order)
                break;
            case 40000:
                if (type === 40001) {
                    GameScene.init(order.data);
                } else if (type === 40002) {
                    const players = order.data;
                    players.forEach(player => {
                        GameScene.addPlayer(player);
                    });
                } else if (type === 40003) {
                    GameScene.addPlayer(order.data);
                }
                break;
            default:
                break;
        }
    }

    _dealOrderMsg(order) {
        const msgOrder = order.data,
            msgBox = this.msgBox,
            myId = GameScene.myModel.userData.id;
        if (!msgBox) return;

        switch (order.order) {
            case 11000:
                if (msgOrder.toId === myId)
                    msgBox.addMsg(msgOrder.fromName + "对你说: " + msgOrder.msg, "person");
                break;
            case 12000:
                const fromName = GameScene.modelMap[order.fromId].userData.name
                msgBox.addMsg("[附近]" + fromName + ": " + msgOrder.msg);
                break;
            case 12002:
                msgBox.addMsg("[综合]" + msgOrder.fromName + ": " + msgOrder.msg);
                break;
            case 13000:
                msgBox.addMsg("[世界]" + msgOrder.fromName + ": " + msgOrder.msg);
                break;
            case 13001:
                msgBox.$appTip(msgOrder.msg)
                break;
            case 13002:
                if (msgOrder.toId === myId)
                    msgBox.addMsg("[系统]" + msgOrder.msg);
                break;
            default:
                break;
        }
    }

    _dealSkillMsg(order) {
        const damageObj = order.data,
            type = order.order;
        switch (type - type % 1000) {
            case 21000:
                // this.showDamage(order.fromId, damageObj.toId, order.order, damageObj.damage);
                // this.showSkill(order.fromId, damageObj.toId, order.order);
                this._actionMoveChange(GameScene.modelMap[order.fromId], 'Punch', 0.2);
                GameScene.showDamage(damageObj.toId, damageObj.damage);
                break;
            case 25000:
                damageObj.forEach(obj => {
                    // this.showDamage(order.fromId, obj.toId, order.order, obj.damage);
                    GameScene.showDamage(obj.toId, obj.damage);
                });
                const model = GameScene.modelMap[order.fromId];
                if (model.moveTween) {
                    model.moveTween.stop();
                    model.moveTween = null;
                }
                this._actionMoveChange(model, 'Punch', 0.2);
                GameScene.showMeleeSkill(model);
                break;
            default:
                break;
        }
    }

    _dealOrderAction(order) {
        const toPoint = order.data,
            type = order.order;
        switch (type) {
            case 31000:
                GameScene.takeDrug(order.fromId, order.data);
                break;
            case 32000:
                this.actionMove(GameScene.modelMap[order.fromId], toPoint);
                break;
            case 32002:
                GameScene.removePlayer(order.data);
                break;
            default:
                break;
        }
    }

    /**
     * action move
     * @param {THREE.Object3D} model 
     * @param {*} toPoint 
     */
    actionMove(model, toPoint) {
        const path = MapCenter.findPath(model.position, toPoint);
        model.path = path;
        if (model.moveTween) {
            model.moveTween.stop();
        }
        model.moveMode = this.getMoveMode(path, model.position);
        this.onMove(model, true);
    }

    getMoveMode(path, position) {
        let point = position, distance = 0;
        path.forEach(p => {
            distance += Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.z - point.z, 2))
            point = p;
        })
        return distance > 20 ? "Running" : "Walking"
    }



    onMove(model, first) {
        const point = model.position,
            toPoint = model.path[0];
        model.path.splice(0, 1);

        const xVal = toPoint.x - point.x,
            zVal = toPoint.z - point.z,
            distance = Math.sqrt(Math.pow(xVal, 2) + Math.pow(zVal, 2)),
            curRotateY = Math.PI / 2 - Math.atan2(zVal, xVal);
        model.rotateY(curRotateY - model.preRobotRotateY);
        model.preRobotRotateY = curRotateY;
        toPoint.y = 0;

        model.moveTween = new TWEEN.Tween(point)
            .to(toPoint, model.moveMode === "Running" ? distance * 100 : distance * 250)
            .onUpdate(() => {
                MapCenter.updateWalkingHeight(model.position);
            })
            .onComplete(() => {
                model.moveTween = null;
                if (model.path.length === 0) {
                    this._actionMoveChange(model, "Idle", 0.3);
                } else {
                    this.onMove(model, false);
                }
            })
            .start();
        this._actionMoveChange(model, model.moveMode, first ? 0.8 : 0);
    }

    _actionMoveChange(model, name, duration) {
        const previousAction = model.activeAction,
            activeAction = model.actions[name];
        if (previousAction !== activeAction) {
            previousAction.fadeOut(duration);
        }
        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
        model.activeAction = activeAction;
    }

    _actionExpressionChange(model, name, val) {
        if (val < -3) {
            val = -3;
        } else if (val > 3) {
            val = 3;
        }
        const head2 = model.getObjectByName("Head_2"),
            dictionary = head2.morphTargetDictionary,
            keys = Object.keys(dictionary);

        for (let i = keys.length - 1; i >= 0; i--) {
            if (keys[i] === name) {
                head2.morphTargetInfluences[i] = val;
                break;
            }
        }
    }
}

export default new GameOrder();