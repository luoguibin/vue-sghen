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
     * @param {Object} container
     * @param {Object} o
     */
    constructor(container, o) {
        const el = document.createElement(o.tag);
        this.el = el;
        this.container = container;
        this.id = container.newId();
        container.addToMap(this);

        this.setStyle(o.style);
        this.setAttribute({ id: this.id, ...o.attribute });
        this.setConfig(o.config);
        this.setChildren(o.children);

        this._oldStyle = JSON.parse(JSON.stringify(o.style));
    }

    setConfig(object) {
        const config = this.config;
        for (const key in object) {
            if (config.hasOwnProperty(key)) {
                config[key] = object[key];
            }
        }
    }

    setStyle(object) {
        if (!object) return;

        const el = this.el,
            style = this.style;

        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const v = object[key];
                style[key] = v;
                el.style[key] = v;
            }
        }
    }

    getStyle(keys) {
        if (!keys) return this.style;

        const result = {};
        keys.forEach(key => {
            result[key] = this._getStyle(key);
        });
        return result;
    }

    resetStyle() {
        this.setStyle(this._oldStyle);
    }

    _getStyle(key) {
        // switch (key) {
        //     case "width":
        //         return this.el.clientWidth;
        //         break;
        //     case "height":
        //         return this.el.clientHeight;
        //         break;
        //     default:
                return this.style[key];
        // }
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

    setChildren(children) {
        if (!children) return;

        children.forEach(o => {
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
        this.el = null;
        this.config = null;
        this.style = null;
        this.attribute = null;
    }
}