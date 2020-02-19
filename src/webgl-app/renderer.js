import { WebGLRenderer, Vector2 } from "three";
import graphics from "./graphics";
import { getGraphicsMode, FBO_FULL_SCREEN } from "./constants";
import settings from "./settings";
import { getTier } from "./profiler";

const { pixelRatio, antialias, maxFrameBufferSize } = graphics[getGraphicsMode()];

const baseSize = Math.sqrt(maxFrameBufferSize.x * maxFrameBufferSize.y);
const maxSize = baseSize * baseSize;

function calculateRenderSize(windowWidth, windowHeight) {
  let width = windowWidth;
  let height = windowHeight;
  if (windowWidth * windowHeight > maxSize) {
    const ratio = height / width;
    width = baseSize;
    height = Math.floor(baseSize * ratio);
    let newSize = width * height;
    const scalar = Math.sqrt(maxSize / newSize);
    width = Math.floor(width * scalar);
    height = Math.floor(height * scalar);
  }
  return {
    width,
    height
  };
}

const renderer = new WebGLRenderer({
  antialias,
  powerPreference: "high-performance",
  stencil: false
});
renderer.setClearColor(0x000000);
export const rendererSize = new Vector2();

export function setRendererSize(windowWidth: Number, windowHeight: Number) {
  let { width, height } = calculateRenderSize(windowWidth, windowHeight);
  if (FBO_FULL_SCREEN) {
    width = windowWidth;
    height = windowHeight;
  }
  rendererSize.x = width;
  rendererSize.y = height;
  renderer.setSize(width, height);
  renderer.domElement.style.width = `${windowWidth}px`;
  renderer.domElement.style.height = `${windowHeight}px`;
}

// Enable shader errors during dev
renderer.debug.checkShaderErrors = settings.isDevelopment;

renderer.setPixelRatio(pixelRatio);
renderer.setScissorTest(true);
setRendererSize(window.innerWidth, window.innerHeight);

const gl = renderer.getContext();
const gpuInfo = gl.getExtension("WEBGL_debug_renderer_info");
const gpu = gl.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL);

if (settings.isDevelopment)
  console.log(`Graphics: ${getGraphicsMode()}\nGPU: ${gpu}\nTier: ${getTier()}`);

export default renderer;
