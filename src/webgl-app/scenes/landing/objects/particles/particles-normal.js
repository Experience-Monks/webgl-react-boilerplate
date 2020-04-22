import {
  Scene,
  Mesh,
  SphereBufferGeometry,
  ShaderMaterial,
  PerspectiveCamera,
  RGBAFormat,
  WebGLRenderTarget,
  WebGLRenderer
} from 'three';
import { VECTOR_ZERO } from '../../../../utils/math';
import createCanvas from '../../../../utils/canvas';

// Render target size
const TEXTURE_SIZE = 128;
// Preview render target in canvas for debugging
const DEBUG_CANVAS = false;

export default class ParticlesNormal {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  renderTarget: WebGLRenderTarget;
  mesh: Mesh;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasFlipped: HTMLCanvasElement;
  ctxFlipped: CanvasRenderingContext2D;
  pixelBuffer: Uint8Array;
  imageData: ImageData;

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer;
    // Create an empty scene
    this.scene = new Scene();
    // Create a new perspective camera
    this.camera = new PerspectiveCamera(60, 1, 0.01, 5);
    // Camera position is set the diameter of the sphere away
    this.camera.position.set(0, 0, 2);
    // Look at the center
    this.camera.lookAt(VECTOR_ZERO);
    // Create render target texture for normal map
    this.renderTarget = new WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE, {
      format: RGBAFormat,
      stencilBuffer: false
    });

    // Setup sphere mesh
    this.mesh = new Mesh(
      new SphereBufferGeometry(1, 32, 32),
      new ShaderMaterial({
        vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            // Pack the normal range from (-1, 1), to (0, 1)
            gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
          }
        `
      })
    );
    this.scene.add(this.mesh);

    // Create debug canvases to preview the render target output
    // Note: Render target outputs pixels on the y-axis inverted
    if (DEBUG_CANVAS) {
      const { canvas, ctx } = createCanvas(TEXTURE_SIZE, TEXTURE_SIZE);
      const { canvas: canvasFlipped, ctx: ctxFlipped } = createCanvas(TEXTURE_SIZE, TEXTURE_SIZE);
      this.canvas = canvas;
      this.ctx = ctx;
      this.canvasFlipped = canvasFlipped;
      this.ctxFlipped = ctxFlipped;

      this.pixelBuffer = new Uint8Array(this.renderTarget.width * this.renderTarget.height * 4);
      this.imageData = this.ctxFlipped.createImageData(this.canvas.width, this.canvas.height);

      Object.assign(canvas.style, {
        top: '0px',
        left: '80px',
        position: 'absolute',
        zIndex: '1000',
        pointerEvents: 'none',
        width: `${TEXTURE_SIZE / 2}px`,
        height: `${TEXTURE_SIZE / 2}px`
      });

      Object.assign(canvasFlipped.style, {
        top: '0px',
        left: `${80 + TEXTURE_SIZE / 2}px`,
        position: 'absolute',
        zIndex: '1000',
        pointerEvents: 'none',
        width: `${TEXTURE_SIZE / 2}px`,
        height: `${TEXTURE_SIZE / 2}px`
      });

      if (document.body) document.body.appendChild(canvas);
      if (document.body) document.body.appendChild(canvasFlipped);
    }
  }

  /**
   * Render the scene into the render target
   *
   * @param {PerspectiveCamera} camera
   * @memberof ParticlesNormal
   */
  render(camera: PerspectiveCamera) {
    // Set the active render target
    this.renderer.setRenderTarget(this.renderTarget);
    // Copy the camera position but limit the length
    this.camera.position.copy(camera.position).setLength(2);
    // Ensure the camera is looking at the center
    this.camera.lookAt(VECTOR_ZERO);
    // Render the scene
    this.renderer.render(this.scene, this.camera);

    if (DEBUG_CANVAS) {
      // Output the render target pixels into the pixel buffer
      this.renderer.readRenderTargetPixels(
        this.renderTarget,
        0,
        0,
        this.renderTarget.width,
        this.renderTarget.height,
        this.pixelBuffer
      );
      // Update the image data
      this.imageData.data.set(this.pixelBuffer);
      this.ctxFlipped.putImageData(this.imageData, 0, 0);
      this.ctx.save();
      // Flip the canvas on the y-axis
      this.ctx.scale(1, -1);
      // Draw the image the correct way
      this.ctx.drawImage(this.canvasFlipped, 0, -this.canvas.height, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }
    // Reset the render target
    this.renderer.setRenderTarget(null);
  }
}
