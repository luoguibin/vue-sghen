import TransformHandler from './transform-handler';

class RotateHandler extends TransformHandler {

  constructor(draggable) {
    super(draggable);
  }

  onStart = (event, dragStart) => {
    this.dragStart = dragStart;

    this.dragStart.originalMatrx = this.getTransformMatrix();
    this.dragStart.center = this.getCenter();
    this.dragStart.angle = Math.atan2(event.clientY - this.dragStart.center.y, event.clientX - this.dragStart.center.x);

    this.draggable.emit('start', {});
  }

  onEnd = () => {
    this.draggable.emit('end', {});
  }

  onGoing = (event, dragOver) => {
    const currentAngle = Math.atan2(dragOver.y - this.dragStart.center.y, dragOver.x - this.dragStart.center.x);
    const da = currentAngle - this.dragStart.angle;

    const c = Math.cos(da);
    const s = Math.sin(da);

    this.draggable.emit('move', { rad: da });
  }
}

export default RotateHandler;
