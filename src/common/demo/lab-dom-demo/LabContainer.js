import LabDom from "./LabDom";

export default class LabContainer {

    /**
     * id序列起始点
     */
    ID_COUNT = 2020000;

    /**
     * 所有LabDom元素对应el的容器
     */
    el = null;

    /**
     * 所有LabDom元素表
     */
    labDomMap = {};

    /**
     * 构造函数
     * @param {HTMLElement} el 
     */
    constructor(el) {
        this.el = el;
        this._addListener(true);
    }

    newId() {
        return this.ID_COUNT++;
    }

    /**
     * 根据给定数据构建LabDom
     * @param {Array} datas 数据类型参照LabDom规范
     */
    setData(datas) {
        if (!datas || !datas instanceof Array) return;
        datas.forEach(o => {
            this.addLabDom(new LabDom(this, o));
        });
    }

    /**
     * 设置鼠标事件回调
     * @param {Function} down 
     * @param {Function} move 
     * @param {Function} up 
     */
    setCall(down, move, up) {
        this.downCall = down;
        this.moveCall = move;
        this.upCall = up;
    }

    /**
     * 重置LabDom为初始创建时的样式
     */
    resetLabDoms() {
        const object = this.labDomMap;
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const o = object[key];
                o.resetStyle(true);
                o.resetConfig();
            }
        }
    }

    addLabDom(labDom) {
        this.el.appendChild(labDom.el);
        this.addToMap(labDom);
    }

    addToMap(labDom) {
        this.labDomMap[labDom.id] = labDom;
    }

    getLabDom(id) {
        return this.labDomMap[id];
    }

    removeLabDomById(id, real) {
        const dom = this.labDomMap[id];
        this.removeLabDom(dom, real);
    }

    removeLabDom(dom, real) {
        if (!dom) return;
        if (real) {
            dom.release();
        }
        delete this.labDomMap[dom.id];
    }

    /**
     *　初始化事件
     * @param {Boolean} isFirst 是否为第一次初始化
     */
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
            return;
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

    /**
     * 移除事件
     */
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
        if (e.target === this.el) return;

        const el = e.target,
            id = el.getAttribute("id");
        if (!id) return;

        if (this.labDomMap[id]) {
            const curLabDom = this.labDomMap[id];
            if (!curLabDom.canDown()) return;
            
            // 注意：这里设置了zIndex，将会影响层叠上下文
            curLabDom.setStyle({ zIndex: curLabDom.config.zIndex + (curLabDom.getStyle("zIndex") || 0) });

            this.curLabDom = curLabDom;
            this.curPoint = this._getEventPoint(e);
            this._addListener();

            this.downCall && this.downCall(curLabDom);
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
            curPoint = this.curPoint,
            leftVal = parseInt(curLabDom.getStyle("left")),
            topVal = parseInt(curLabDom.getStyle("top"));

        const addLeft = curPoint_.x - curPoint.x,
            addTop = curPoint_.y - curPoint.y;
        curLabDom.setStyle({
            left: leftVal + addLeft + "px",
            top: topVal + addTop + "px"
        });

        this.isMove = true;
        this.curPoint = curPoint_;

        this.moveCall && this.moveCall(curLabDom, addLeft, addTop);
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

        // console.log("_onMouseUp() " + this.curLabDom.id + " isMove=" + this.isMove);
        curLabDom.setStyle({ zIndex: curLabDom.getStyle("zIndex") - curLabDom.config.zIndex });

        this.upCall && this.upCall(curLabDom, this.isMove);

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

    release() {
        this.downCall = null;
        this.moveCall = null;
        this.upCall = null;
        
        Object.keys(this.labDomMap).forEach(key => {
            this.removeLabDomById(key, true);
        });

        this.labDomMap = null;
    }
}