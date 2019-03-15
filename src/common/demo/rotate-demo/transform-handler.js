import Draggable from "./draggable";

class TransformHandler {

  /**
   * 构造函数
   * @param {Draggable} draggable 
   */
  constructor(draggable) {
    this.draggable = draggable;
  }

  getTransformMatrix = (dom) => {
    const domToBeComputed = dom || this.draggable.dom;

    const style = getComputedStyle(domToBeComputed);

    const transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? mat[1].split(', ').map(n => parseFloat(n)) : [1, 0, 0, 1, 0, 0];
  }

  getCenter(dom) {
    const domToBeComputed = dom || this.draggable.dom;
    const style = getComputedStyle(domToBeComputed),
      transformOrigin = style.transformOrigin || style.webkitTransformOrigin;
    const origin = transformOrigin.split(" ").map(v => parseFloat(v));
    return {
      x: parseFloat(style.left) + origin[0],
      y: parseFloat(style.top) + origin[1],
    };
  }

  matrixProduct_2d = (m1, m2) => {
    return [
      ((m1[0] * m2[0]) + (m1[1] * m2[2])),
      ((m1[0] * m2[1]) + (m1[1] * m2[3])),
      ((m1[2] * m2[0]) + (m1[3] * m2[2])),
      ((m1[2] * m2[1]) + (m1[3] * m2[3])),
    ];
  }

  release() {
    this.draggable = null;
  }
}

export default TransformHandler;
