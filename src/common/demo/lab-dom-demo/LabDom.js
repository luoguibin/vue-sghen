// 数据规范
const object = {
    tag: "div",
    config: {
        action: 0, // 0表示不可点击， 1表示可点击， 2表示可拖动并点击
        zIndex: 100  // 点击、拖动则提升元素zIndex
    },
    attribute: {
        id: "lab-wave",//节点属性id，唯一
        "my-data": 2019//可自定义节点属性
    },
    style: {　//标准css属性，部分仅支持像素附加单位，例如width=100不支持
        width: "100px",
        height: "100px",
        position: "absolute",
        top: "0px",
        left: "0px",
        border: "3px solid white",
        borderRadius: "50%",
        zIndex: 100,
        pointerEvents: "none"
    },
    innerHTML: "", // 可选
    children: [
        // 孩子节点，数据规范同上
    ]
}

// 步骤规范
const step = {
    id: "cap-set",    // 必须属性

    /* 步骤开始时的属性设置 */
    // config: {},
    // attribute: {},
    // style: {},
    wave: true,       // 可选，是否波纹提示自身
    config: {
        action: 2
    },

    /* 步骤过程中的属性设置 */
    twinkle: true,    // 可选，是否闪烁提示目标位置，配合style_使用，用于拖动元素至style_指定的位置
    // limit: 30,     // 可选，拖动到指定位置与目标位置的距离容差
    // follow: {         // 可选，跟随的元素，暂时只设置位置属性
    //   id: "cap-set-1",
    //   style: {},      
    //   style_: {}
    // },

    /*　步骤结束前的属性设置 */
    config_: {        // 可选，拖动至目标位置后，设置配置参数（配置参数见LabDom中定义）
        action: 0
    },
    style_: {         // 可选,一步骤结束前、或拖动到指定位置后设置样式
        left: "530px",
        top: "250px"
    },
    // attribute: {}
}

export default class LabDom {

    container = null;
    id = null;
    el = null;

    config = {
        action: 0,
        zIndex: 100
    };
    style = {};
    attribute = {};

    /**
     * constructor
     * @param {Object} container　LabDom的父容器
     * @param {Object} o　参见头部数据规范
     */
    constructor(container, o) {
        const el = document.createElement(o.tag);
        if (o.innerHTML) el.innerHTML = o.innerHTML;
        this.el = el;

        const attr = { id: container.newId(), ...o.attribute };
        this.id = attr.id;
        container.addToMap(this);
        this.container = container;

        this.setConfig(o.config);
        this.setStyle(o.style);
        this.setAttribute(attr);
        this.setChildren(o.children);

        this._oldStyle = JSON.parse(JSON.stringify(o.style || {}));
        this._oldConfig = JSON.parse(JSON.stringify(o.config || {}));
    }

    setConfig(object) {
        if (!object) return;
        const config = this.config;
        for (const key in object) {
            if (config.hasOwnProperty(key)) {
                config[key] = object[key];
            }
        }
    }

    /**
     * 设置样式，格式参见数据规范
     * @param {Object} object 
     * @param {Boolean} clear 是否清除所有css样式
     */
    setStyle(object, clear) {
        if (!object) return;

        const el = this.el;
        let style = this.style;

        if (clear) {
            el.style.cssText = "";
            this.style = {};
            style = this.style;
        }

        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const v = object[key];
                style[key] = v;
                el.style[key] = v;
            }
        }
    }

    /**
     * 获取设置的style
     * @param {Array} keys 
     */
    getStyles(keys) {
        if (!keys) return this.style;

        const result = {};
        keys.forEach(key => {
            result[key] = this.getStyle(key);
        });
        return result;
    }

    /**
     * 获取单个css属性
     * @param {String} key 
     */
    getStyle(key) {
        return this.style[key];
    }

    getWidthLeft() {
        const result = {};
        ["width", "height", "left", "top"].forEach(key => {
            result[key] = parseInt(this.getStyle(key)) || 0;
        });
        return result;
    }

    resetStyle(clear) {
        this.setStyle(this._oldStyle, clear);
    }

    resetConfig() {
        this.setConfig(this._oldConfig);
    }

    setAttribute(object) {
        if (!object) return;

        const el = this.el;
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                el.setAttribute(key, object[key]);
            }
        }
    }

    getAttribute(key) {
        return this.el.getAttribute(key);
    }

    /**
     * 设置孩子LabDom，禁止二代孩子创建
     * @param {Array} children 
     */
    setChildren(children) {
        if (!children || !children instanceof Array) return;
        if (this.attribute.parentId) return;

        children.forEach(o => {
            if (!o.attribute) o.attribute = {};
            o.attribute.parentId = this.id;
            this.appendChild(new LabDom(this.container, o));
        });
    }

    appendChild(child) {
        this.el.appendChild(child.el);
    }

    canDown() {
        return this.config.action > 0;
    }

    canMove() {
        return this.config.action > 1;
    }

    release() {
        this.el.remove();
        this.el = null;

        this.config = null;
        this.style = null;
        this.attribute = null;
    }
}