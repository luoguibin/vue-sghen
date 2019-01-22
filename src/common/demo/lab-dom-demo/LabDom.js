import { LabContainer } from "./LabContainer";

export class LabDom {

    static STYLES_CONFIG = {
        opacity: 0,

        // number + string value
        width: 1,
        height: 1,
        left: 1,
        top: 1,

        // number value
        zIndex: 2,

        // string value
        position: 3,
        transformOrigin: 3,
        transform: 3
    }

    styles = {};
    attributes = {};

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
        this.config = config;

        const el = document.createElement(label);
        el.setAttribute("lab-id", this.id);
        container.appendChild(el);
        this.el = el;
    }

    canDown() {
        return this.config.action > 0;
    }

    canMove() {
        return this.config.action > 2;
    }

    setInnerHTML(innerHTML) {
        if (this.label === "div" || this.label === "p" || this.label === "span") {
            this.el.innerHTML = innerHTML;
        }
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

    release() {
        this.container = null;
    }
}