import EventEmitter from 'eventemitter3';
import detect from '@jam3/detect';

/**
 * A class to normalize mouse and touch events
 *
 * @export
 * @class TouchControls
 * @extends {EventEmitter}
 */
export default class TouchControls extends EventEmitter {
  constructor(element: HTMLElement, options: Object = {}) {
    super();
    this.element = element;
    this.pointers = [];
    this.options = Object.assign(
      {
        hover: false, // mouse only
        touchStart: true,
        touchMove: true,
        touchEnd: true
      },
      options
    );
    this.touchesLength = 0;
    this.isDown = false;
    this.bindEvents(true);
  }

  /**
   * Bind mouse and touch events
   *
   * @memberof TouchControls
   */
  bindEvents = (bind: Boolean) => {
    const listener = bind ? 'addEventListener' : 'removeEventListener';
    const isDesktop = detect.device.isDesktop;
    if (this.options.touchStart) this.element[listener](isDesktop ? 'mousedown' : 'touchstart', this.onTouchStart);
    if (this.options.touchMove) this.element[listener](isDesktop ? 'mousemove' : 'touchmove', this.onTouchMove);
    if (this.options.touchEnd) this.element[listener](isDesktop ? 'mouseup' : 'touchend', this.onTouchEnd);
    if (isDesktop) {
      if (this.options.hover) this.element[listener]('mouseover', this.onMouseOver);
      if (this.options.hover) this.element[listener]('mouseout', this.onMouseOut);
    }
  };

  /**
   * Update the list of current inputs
   * and set the data
   *
   * @memberof TouchControls
   */
  setPointers = (event: Object) => {
    this.pointers = [];
    if (event.touches) {
      this.touchesLength = event.touches.length;
      for (let i = 0; i < this.touchesLength; i++) {
        const pointer = event.touches[i];
        this.pointers.push({
          x: pointer.pageX,
          y: pointer.pageY,
          normalX: pointer.pageX / window.innerWidth,
          normalY: pointer.pageY / window.innerHeight
        });
      }
    } else {
      this.pointers.push({
        x: event.pageX,
        y: event.pageY,
        normalX: event.pageX / window.innerWidth,
        normalY: event.pageY / window.innerHeight
      });
    }
  };

  /**
   * Touch start handler
   *
   * @memberof TouchControls
   */
  onTouchStart = (event: Object) => {
    this.isDown = true;
    this.setPointers(event);
    this.emit('start', this.pointers);
  };

  /**
   * Touch move handler
   *
   * @memberof TouchControls
   */
  onTouchMove = (event: Object) => {
    this.onMouseMove(event);
    if (!this.isDown) return;
    this.setPointers(event);
    this.emit('move', this.pointers);
  };

  /**
   * Touch end handler
   *
   * @memberof TouchControls
   */
  onTouchEnd = (event: Object) => {
    this.isDown = false;
    this.emit('end', this.pointers);
  };

  /**
   * Mouse move handler
   *
   * @memberof TouchControls
   */
  onMouseMove = (event: Object) => {
    this.setPointers(event);
    this.emit('mousemove', this.pointers);
  };

  /**
   * Mouse over handler
   *
   * @memberof TouchControls
   */
  onMouseOver = (event: Object) => {
    this.emit('hover', true);
  };

  /**
   * Mouse out handler
   *
   * @memberof TouchControls
   */
  onMouseOut = (event: Object) => {
    this.emit('hover', false);
  };

  /**
   * Dispose and unbind events
   *
   * @memberof TouchControls
   */
  dispose = () => {
    this.bindEvents(false);
  };
}
