import EventEmitter from 'eventemitter3';
import detect from '@jam3/detect';

type touchControlsOptions = {|
  touchStart?: boolean,
  touchMove?: boolean,
  touchEnd?: boolean,
  hover?: boolean
|};

export type pointersArray = {|
  x: number,
  y: number,
  normalX: number,
  normalY: number
|};

type pointersEvent = {|
  push: ({| x: number, y: number, normalX: number, normalY: number |}) => void,
  touches: {|
    pageX: boolean,
    pageY: boolean,
    length: number
  |},
  MouseEvent: MouseEvent
|};

/**
 * A class to normalize mouse and touch events
 *
 * @export
 * @class TouchControls
 * @extends {EventEmitter}
 */
export default class TouchControls extends EventEmitter {
  constructor(element: HTMLElement, options: touchControlsOptions) {
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
  bindEvents = (bind: boolean) => {
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
  setPointers = (event: pointersEvent) => {
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
  onTouchStart = (event: pointersEvent) => {
    this.isDown = true;
    this.setPointers(event);
    this.emit('start', this.pointers);
  };

  /**
   * Touch move handler
   *
   * @memberof TouchControls
   */
  onTouchMove = (event: pointersEvent) => {
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
  onTouchEnd = () => {
    this.isDown = false;
    this.emit('end', this.pointers);
  };

  /**
   * Mouse move handler
   *
   * @memberof TouchControls
   */
  onMouseMove = (event: pointersEvent) => {
    this.setPointers(event);
    this.emit('mousemove', this.pointers);
  };

  /**
   * Mouse over handler
   *
   * @memberof TouchControls
   */
  onMouseOver = (event: pointersEvent) => {
    this.emit('hover', true);
  };

  /**
   * Mouse out handler
   *
   * @memberof TouchControls
   */
  onMouseOut = (event: pointersEvent) => {
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
