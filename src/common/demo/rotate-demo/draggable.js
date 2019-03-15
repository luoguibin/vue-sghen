import RotateHandler from './rotate-handler';

class Draggable {

  /**
   * 构造函数
   * @param {HTMLElement} dom 
   */
  constructor(dom) {
    this.parent = dom.parentElement;
    this.dom = dom;
    this.handler = new RotateHandler(this);

    this.linkEvents();
  }

  setCall(callStart, callMove, callEnd) {
    this.callStart = callStart;
    this.callMove = callMove;
    this.callEnd = callEnd;
  }

  linkEvents = () => {
    this.dom.addEventListener('mousedown', this.mousedown);
    this.parent.addEventListener('mousemove', this.mousemove);
    this.parent.addEventListener('mouseup', this.mouseup);
    this.parent.addEventListener('mouseleave', this.mouseleave);

    if ("ontouchend" in document ? true : false) {
      this.dom.addEventListener('touchstart', this.touchstart);
      this.parent.addEventListener('touchmove', this.touchmove);
      this.parent.addEventListener('touchend', this.touchend);
    }
  }

  unlinkEvents = () => {
    this.dom.removeEventListener('mousedown', this.mousedown);
    this.parent.removeEventListener('mousemove', this.mousemove);
    this.parent.removeEventListener('mouseup', this.mouseup);
    this.parent.removeEventListener('mouseleave', this.mouseleave);

    if ("ontouchend" in document ? true : false) {
      this.dom.removeEventListener('touchstart', this.touchstart);
      this.parent.removeEventListener('touchmove', this.touchmove);
      this.parent.removeEventListener('touchend', this.touchend);
    }
  }

  mousedown = (event) => {
    const dragStart = {
      x: event.clientX,
      y: event.clientY
    };

    this.isActive = true;
    this.handler.onStart(event, dragStart);
  }

  mouseup = (event) => {
    if (this.isActive) {
      const dragEnd = {
        x: event.clientX,
        y: event.clientY,
      };
      this.handler.onEnd(event, dragEnd);
      this.isActive = false;
    }
  }

  mousemove = (event) => {
    if (this.isActive) {
      const dragOver = {
        x: event.clientX,
        y: event.clientY,
      };
      this.handler.onGoing(event, dragOver);
    }
  }

  mouseleave = (event) => {
    this.isActive = false;
  }

  touchstart = (event) => {
    const clientX = event.touches[0].clientX,
      clientY = event.touches[0].clientY;

    const dragStart = {
      x: clientX,
      y: clientY
    };
    event.clientX = clientX;
    event.clientY = clientY;

    this.isActive = true;
    this.handler.onStart(event, dragStart);
  }

  touchend = (event) => {
    if (this.isActive) {
      const dragEnd = {
        // x: event.touches[0].clientX,
        // y: event.touches[0].clientY,
      };
      this.handler.onEnd(event, dragEnd);
      this.isActive = false;
    }
  }

  touchmove = (event) => {
    if (this.isActive) {
      const dragOver = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      this.handler.onGoing(event, dragOver);
    }
  }

  emit(key, obj) {
    switch (key) {
      case 'start': this.callStart && this.callStart(obj);
        break;
      case 'move': this.callMove && this.callMove(obj);
        break;
      case 'end': this.callEnd && this.callEnd(obj);
        break;
    }
  }

  release() {
    this.unlinkEvents();
    this.handler.release();

    this.handler = null;
    this.callStart = null;
    this.callMove = null;
    this.callEnd = null;
  }
}

export default Draggable;
