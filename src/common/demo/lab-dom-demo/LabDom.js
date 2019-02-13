export class LabDom {

    static STYLES_CONFIG = {
        opacity: 0,

        // number + string value
        width: 1,
        height: 1,
        left: 1,
        top: 1,
        padding: 1,

        // number value
        zIndex: 2,

        // string value
        position: 3,
        transformOrigin: 3,
        transform: 3,
        border: 3
    }

    styles = {};
    attributes = {};

    parent = null;
    children = [];

    /**
     * constructor
     * @param {LabContainer} container 
     * @param {String} label 
     * @param {Object} config
     */
    constructor(container, label, config) {
        this.container = container;
        this.id = container.newId();
        this.label = label;
        this.config = config || {};

        const el = document.createElement(label);
        el.setAttribute("lab-id", this.id);
        this.el = el;
    }

    canDown() {
        return this.config.action > 0;
        // if (this.config.action > 0) return true;
        // else if (this.parent) {
        //     return this.parent.canDown();
        // } else return false;
    }

    canMove() {
        return this.config.action > 2;
        // if (this.config.action > 2) return true;
        // else if (this.parent) {
        //     return this.parent.canMove();
        // } else return false;
    }

    setInnerHTML(innerHTML) {
        if (this.el.innerHTML === undefined) return;
        this.el.innerHTML = innerHTML;
    }

    setStyle(style) {
        const _style = this.el.style,
            styles = this.styles;

        for (const key in style) {
            const val = LabDom.STYLES_CONFIG[key];
            if (style.hasOwnProperty(key) && val > 0) {
                styles[key] = style[key];
                if (val < 2) {
                    _style[key] = style[key] + "px";
                } else {
                    _style[key] = style[key];
                }
            }
        }
    }

    getStyles() {
        return this.styles;
    }

    addStyle(style) {
        const styles = this.styles;

        for (const key in style) {
            const val = LabDom.STYLES_CONFIG[key];
            if (style.hasOwnProperty(key)) {
                if (0 < val && val < 3) {
                    style[key] = (styles[key] || 0) + style[key];
                } else {
                    delete style[key];
                }
            }
        }
        this.setStyle(style);
    }

    setAttributes(keyVals) {
        const el = this.el,
            attributes = this.attributes;
        for (const key in keyVals) {
            if (keyVals.hasOwnProperty(key)) {
                attributes[key] = keyVals[key];
                el.setAttribute(key, keyVals[key]);
            }
        }
    }

    addChild(labDom) {
        if (this.label !== "div") return;
        if (labDom.el.parentElement) return;
        labDom.parent = this;
        this.el.appendChild(labDom.el);
        this.children.push(labDom);
        this.container.addLabDom(labDom);
    }

    containChild(id) {
        const labDom = this.children.find(o => {
            return o.id === id;
        });
        return labDom;
    }

    removeChild(id) {
        const labDom = this.containChild(id);
        if (labDom) {
            const index = this.children.findIndex(o => {
                return id === o.id;
            })
            this.children.splice(index, 1);
            this.el.removeChild(labDom.el);
        }
        return labDom;
    }

    removeChildren() {
        const children = this.children,
            len = children.length;
        if (!len) return;
        const el = this.el;
        for (let i = len - 1; i >= 0; i--) {
            const labDom = children[i];
            el.removeChild(labDom.el);
            labDom.release();
            children.splice(i, 1);
        }
    }

    release() {

        this.container = null;
        this.children = null;
    }
}