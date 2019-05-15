const isOver = span => {
    let ctx;
    if (window.tooltipCanvasCtx) {
        ctx = window.tooltipCanvasCtx;
    } else {
        window.tooltipCanvasCtx = document.createElement("canvas").getContext("2d");
        ctx = window.tooltipCanvasCtx;
    }
    const style = getComputedStyle(span);
    ctx.font = `${style.fontSize} ${style.fontFamily}`;
    const width = Math.ceil(ctx.measureText(span.innerText || span.value).width);
    const maxWidth = Math.ceil(
        parseInt(style.width, 10) -
        (parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10))
    );
    return width > maxWidth;
};
export default {
    beforeCreate() {
        let r = this.$options.render;
        this.$options.render = (h, ...args) => {
            return h(
                "div",
                {
                    attrs: {
                        id: "app"
                    }
                },
                [
                    r.apply(this, [h, ...args]),
                    this.tpVisible
                        ? h("el-popover", {
                            key: this.tpKey,
                            ref: "popover",
                            attrs: {
                                reference: this.tpRef,
                                content: this.tpCtn,
                                placement: "bottom-start"
                            }
                        })
                        : null
                ]
            );
        };
    },
    data() {
        return {
            classMatched: ["cell", "el-select-dropdown__item", "el-input__inner"],
            tpRef: null,
            tpCtn: "",
            tpKey: "",
            tpVisible: false
        };
    },
    mounted() {
        this.bind();
    },
    methods: {
        bind() {
            let docEl = document.documentElement;
            docEl.addEventListener("mouseenter", this.onMouseenter, true);
            docEl.addEventListener("mouseenter", this.onMouseleave, true);
        },
        doTpShow(el) {
            this.$set(this, "tpCtn", el.innerText || el.value);
            this.$set(this, "tpRef", el);
            this.$set(this, "tpKey", Date.now());
            this.$set(this, "tpVisible", true);
            this.$nextTick(() => {
                this.$refs.popover &&
                    this.$refs.popover.doShow &&
                    this.$refs.popover.doShow();
            });
        },
        doTpClose() {
            this.$set(this, "tpCtn", "");
            this.$set(this, "tpRef", null);
            this.$set(this, "tpKey", "");
            this.$set(this, "tpVisible", false);
        },
        isIncludes(className) {
            if (typeof className != "string") return false;
            className = className.split(" ");
            return className.some(cls => this.classMatched.includes(cls));
        },
        isPopover(className) {
            className = className.split(" ");
            return className.some(cls => cls == "el-popover");
        },
        onMouseenter(event) {
            if (this.tpRef) return;
            let el = event.target;
            if (this.isIncludes(el.className)) {
                if (el && (el.innerText || el.value) && isOver(el)) {
                    this.doTpShow(el);
                }
            }
        },
        onMouseleave(event) {
            if (!this.tpRef) return;
            let el = event.target;
            if (
                el != this.tpRef &&
                !this.tpRef.contains(el) &&
                !this.isPopover(el.className)
            ) {
                this.doTpClose();
            }
        }
    }
};
