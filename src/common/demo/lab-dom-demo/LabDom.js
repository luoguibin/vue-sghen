// 数据规范
const o = {
    tag: "div",
    config: {
        action: 0 // 0表示不可点击， 1表示可点击， 2表示可拖动并点击
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
    children: [
        // 孩子节点，数据规范同上
    ]
}

export default class LabDom {

    container = null;
    id = null;
    el = null;

    config = {
        action: 0
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
        this.el = el;

        this.setStyle(o.style);
        const attr = { id: container.newId(), ...o.attribute };
        this.id = attr.id;
        this.container = container;
        container.addToMap(this);
        this.setAttribute(attr);
        this.setConfig(o.config);
        this.setChildren(o.children);

        this._oldStyle = JSON.parse(JSON.stringify(o.style || {}));
        this._oldConfig = JSON.parse(JSON.stringify(o.config || {}))
    }

    setConfig(object) {
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
            // for (const key in style) {
            //     if (style.hasOwnProperty(key)) {
            //         if (object[key] === undefined) {
            //             el.style[key] = undefined;
            //         }
            //     }
            // }
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