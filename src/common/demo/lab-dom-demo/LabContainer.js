import { LabDom } from "./LabDom";

export class LabContainer {

    ID_COUNT = 2020000;

    labDomMap = {};

    /**
     * constructor
     * @param {HTMLElement} el 
     */
    constructor(el) {
        this.el = el;
        this._addListener(true);

        this.test();
    }

    test() {
        for (let i = 0; i < 3; i++) {
            const labDom = new LabDom(this, "img", { action: 3 });
            labDom.setStyle({ width: 200, height: 120, position: "absolute", left: 300, top: 200 });
            labDom.setAttributes({ src: require("@/assets/textures/grass.png") });
            this.labDomMap[labDom.id] = labDom;
        }
        for (let i = 0; i < 2; i++) {
            const labDom = new LabDom(this, "div", { action: i });
            labDom.setStyle({ position: "absolute", left: 300 * i, top: 200 });
            labDom.setInnerHTML("message-" + i);
            this.labDomMap[labDom.id] = labDom;
        }
    }

    _addListener(isFirst) {
        const el = this.el;
        if (isFirst) {
            this._onMouseDown = this._onMouseDown.bind(this);
            this.onTouchStart = this.onTouchStart.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onMouseLeave = this._onMouseLeave.bind(this);

            el.addEventListener("mousedown", this._onMouseDown);
            el.addEventListener("touchstart", this.onTouchStart);

            el.ondragstart = function () {
                return false;
            }
        }
        if (this.isTouch) {
            el.addEventListener("touchmove", this._onMouseMove);
            el.addEventListener("touchend", this._onMouseUp);
        } else {
            el.addEventListener("mousemove", this._onMouseMove);
            el.addEventListener("mouseup", this._onMouseUp);
            el.addEventListener("mouseleave", this._onMouseLeave);
        }
    }

    _removeListener() {
        const el = this.el;

        if (this.isTouch) {
            el.removeEventListener("touchmove", this._onMouseMove);
            el.removeEventListener("touchend", this._onMouseUp);
        } else {
            el.removeEventListener("mousemove", this._onMouseMove);
            el.removeEventListener("mouseup", this._onMouseUp);
            el.removeEventListener("mouseleave", this._onMouseLeave);
        }
    }

    /**
    * 触摸开始事件
    * @param {TouchEvent} e
    */
    onTouchStart(e) {
        this.isTouch = true;
        this._onMouseDown(e.touches[0]);
    }

    /**
     * 鼠标按下事件
     * @param {MouseEvent} e
     */
    _onMouseDown(e) {
        if (e.target === this.el) {
            return;
        }
        const el = e.target,
            id = el.getAttribute("lab-id");

        if (id && this.labDomMap[id]) {
            const curLabDom = this.labDomMap[id];
            if (!curLabDom.canDown()) return;

            curLabDom.addStyle({ zIndex: 100 });
            this.curLabDom = curLabDom;
            this.curPoint = this._getEventPoint(e);
            this._addListener();
        }
    }

    /**
     * 触摸持续移动事件或者鼠标移动事件
     * @param {MouseEvent | TouchEvent} e
     */
    _onMouseMove(e) {
        const curLabDom = this.curLabDom;
        if (!curLabDom) return;
        if (!curLabDom.canMove()) return;

        const curPoint_ = this._getEventPoint(this.isTouch ? e.touches[0] : e),
            curPoint = this.curPoint;
        curLabDom.addStyle({
            left: curPoint_.x - curPoint.x,
            top: curPoint_.y - curPoint.y
        });

        this.isMove = true;
        this.curPoint = curPoint_;
    }

    /**
     * 鼠标移出可操作区域
     * @param {MouseEvent} e
     */
    _onMouseLeave(e) {
        this._onMouseUp(e);
    }

    /**
     * 鼠标抬起事件或者触摸结束事件
     * @param {MouseEvent | TouchEvent} e
     */
    _onMouseUp(e) {
        const curLabDom = this.curLabDom;
        if (!curLabDom) return;

        console.log("_onMouseUp() " + this.curLabDom.id + " isMove=" + this.isMove);
        this.curLabDom.addStyle({ zIndex: -100 });
        this.curLabDom = null;

        this._removeListener();
        this.isTouch = false;
        this.isMove = false;
    }

    _getEventPoint(e) {
        const el = this.el,
            rect = el.getBoundingClientRect(),
            scale = this.labScale || 1;

        const x = (e.clientX - rect.left) / scale,
            y = (e.clientY - rect.top) / scale;
        return { x, y };
    }

    appendChild(el) {
        this.el.appendChild(el);
    }

    newId() {
        return this.ID_COUNT++;
    }
}