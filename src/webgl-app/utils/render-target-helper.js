import { WebGLRenderTarget } from 'three';
import createCanvas from './canvas';
import renderer from '../rendering/renderer';

export default class RenderTargetHelper {
  renderTarget: WebGLRenderTarget;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasFlipped: HTMLCanvasElement;
  ctxFlipped: CanvasRenderingContext2D;
  pixelBuffer: Uint8Array;
  imageData: ImageData;

  constructor(renderTarget: WebGLRenderTarget, options: Object = {}) {
    this.renderTarget = renderTarget;

    const { canvas, ctx } = createCanvas(renderTarget.width, renderTarget.height);
    const { canvas: canvasFlipped, ctx: ctxFlipped } = createCanvas(renderTarget.width, renderTarget.height);
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasFlipped = canvasFlipped;
    this.ctxFlipped = ctxFlipped;
    this.imageData = this.ctxFlipped.createImageData(this.canvas.width, this.canvas.height);
    this.pixelBuffer = new Uint8Array(this.renderTarget.width * this.renderTarget.height * 4);

    Object.assign(canvas.style, {
      position: 'absolute',
      zIndex: '1000',
      border: '1px solid white',
      pointerEvents: 'none',
      width: `${renderTarget.width}px`,
      height: `${renderTarget.height}px`
    });
    this.setCssPosition(options);

    if (document.body) document.body.appendChild(this.canvas);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasFlipped.width = width;
    this.canvasFlipped.height = height;
    this.renderTarget.setSize(this.canvas.width, this.canvas.height);
    this.imageData = this.ctxFlipped.createImageData(this.canvas.width, this.canvas.height);
    this.pixelBuffer = new Uint8Array(this.renderTarget.width * this.renderTarget.height * 4);
    this.canvas.style.width = `${this.renderTarget.width / 2}px`;
    this.canvas.style.height = `${this.renderTarget.height / 2}px`;
  }

  setCssPosition(style: Object) {
    this.canvas.style.top = `${style.top / 2 || 0}px`;
    this.canvas.style.left = `${style.left || 0}px`;
  }

  update() {
    renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.renderTarget.width,
      this.renderTarget.height,
      this.pixelBuffer
    );
    this.imageData.data.set(this.pixelBuffer);
    this.ctxFlipped.putImageData(this.imageData, 0, 0);
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.drawImage(this.canvasFlipped, 0, -this.canvas.height, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}
