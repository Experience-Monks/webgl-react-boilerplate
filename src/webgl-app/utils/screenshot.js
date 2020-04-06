import { WebGLRenderTarget, LinearFilter, RGBAFormat, PerspectiveCamera } from 'three';
import { GUI } from 'dat.gui';
import { saveAs } from 'file-saver';
import createCanvas from './canvas';
import { rendererSize } from '../rendering/resize';
import renderer, { postProcessing } from '../rendering/renderer';
import BaseScene from '../scenes/base/base-scene';

const DEBUG_RENDER = false;

/**
 * This screenshot utility renders out a custom size render and saves it to an image
 * Please note if the post processing passes change it will require updating
 *
 * @export
 * @class Screenshot
 */
export default class Screenshot {
  gui: GUI;
  renderTargetA: WebGLRenderTarget;
  renderTargetB: WebGLRenderTarget;
  imageData: ImageData;
  canvas: HTMLCanvasElement;
  canvasFlipped: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctxFlipped: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelBuffer: Uint8Array;

  constructor(gui: GUI, width: number, height: number, pixelRatio: number = 1) {
    this.gui = gui.addFolder('screenshot');
    this.gui.open();
    this.width = width * pixelRatio;
    this.height = height * pixelRatio;

    this.renderTargetA = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: false
    });
    this.renderTargetB = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: false
    });

    const { canvas, ctx } = createCanvas(this.width, this.height);
    const { canvas: canvasFlipped, ctx: ctxFlipped } = createCanvas(this.width, this.height);

    this.canvas = canvas;
    this.canvasFlipped = canvasFlipped;
    this.ctx = ctx;
    this.ctxFlipped = ctxFlipped;

    this.pixelBuffer = new Uint8Array(this.renderTargetA.width * this.renderTargetA.height * 4);
    this.imageData = this.ctxFlipped.createImageData(this.canvas.width, this.canvas.height);

    if (DEBUG_RENDER) {
      Object.assign(this.canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '100',
        border: '1px solid white',
        pointerEvents: 'none',
        width: `${width}px`,
        height: `${height}px`
      });
      if (document.body) document.body.appendChild(this.canvas);
    }
  }

  /**
   * Save the canvas to an image
   *
   * @memberof Screenshot
   */
  save = () => {
    const quality = 0.75;
    const filename = 'screenshot.jpg';
    const format = 'image/jpeg';
    this.canvas.toBlob(
      function(blob) {
        saveAs(blob, filename);
      },
      format,
      quality
    );
  };

  /**
   * Capture the current scene and save to an image
   *
   * @memberof Screenshot
   */
  capture = (scene: BaseScene, camera: PerspectiveCamera) => {
    // Clear current context
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save aspect for resetting after render
    const aspect = camera.aspect;

    // Update aspect to the screenshot size ratio
    camera.aspect = this.width / this.height;
    camera.updateProjectionMatrix();

    // Save current width / height
    const finalPassWidth = postProcessing.finalPass.mesh.material.uniforms.resolution.value.x;
    const finalPassHeight = postProcessing.finalPass.mesh.material.uniforms.resolution.value.y;
    const left = 0;
    const bottom = 0;
    const width = rendererSize.x;
    const height = rendererSize.y;

    // Update renderer viewport, this will get reset in the main render loop
    // inside webgl-app.js
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);

    // Update the final pass uniforms
    postProcessing.finalPass.resize(this.width, this.height);

    // Render the current scene into renderTargetA
    renderer.setRenderTarget(this.renderTargetA);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // Apply the post processing fx which is output into renderTargetB
    postProcessing.finalPass.screenshotRender(scene, camera, this.renderTargetA, this.renderTargetB, 0);
    // Put the rendered pixels into the pixelBuffer
    renderer.readRenderTargetPixels(
      this.renderTargetB,
      0,
      0,
      this.renderTargetB.width,
      this.renderTargetB.height,
      this.pixelBuffer
    );
    this.imageData.data.set(this.pixelBuffer);

    // The image is rendered upside down, so we flip it
    this.ctxFlipped.putImageData(this.imageData, 0, 0);
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.drawImage(this.canvasFlipped, 0, -this.canvas.height, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    // Reset the camera aspect
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Reset the finalpass uniforms
    postProcessing.finalPass.resize(finalPassWidth, finalPassHeight);

    // Save out the image
    this.save();
  };
}
