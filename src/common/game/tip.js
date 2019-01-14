export const Tip = {

  ele: null,
  list: [],

  styles: {
    "position": "absolute",
    "display": "none",
    "top": "0",
    "left": "0",
    "right": "0",
    "z-index": "2018",
    "padding": "5px",
    "font-size": "16px",
    "text-align": "center",
    "background-color": "rgba(20,138,207, 0.75)"
  },

  showTip(txt, after) {
    if (!this.ele) {
      const ele_ = document.createElement("DIV"),
        styles = this.styles;

      ele_.id = "app-tip";
      for (const key in styles) {
        if (styles.hasOwnProperty(key)) {
          ele_.style[key] = styles[key];
        }
      }
      document.body.appendChild(ele_);
      this.ele = ele_;
    }

    if (this.timer) {
      if (!after) clearTimeout(this.timer);
      else {
        this.list.push(txt);
        return;
      }
    }

    const ele = this.ele;
    ele.innerHTML = txt;
    ele.style.display = "block";

    this.timer = setTimeout(() => {
      ele.style.display = "none";
      this.timer = null;
      if (this.list.length > 0) {
        this.showTip(this.list[0]);
        this.list.splice(0, 1);
      }
    }, 2500)
  }
}
