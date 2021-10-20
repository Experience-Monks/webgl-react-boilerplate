import { WebGLRenderer } from 'three';
import graphics, { getGraphicsMode, getTier } from './graphics';
import settings from '../settings';
import { setRendererSize } from './resize';

const { pixelRatio, antialias } = graphics[getGraphicsMode()];

const renderer = new WebGLRenderer({
  antialias,
  powerPreference: 'high-performance',
  stencil: false
});
renderer.setClearColor(0x000000);

// Enable shader errors during dev
renderer.debug.checkShaderErrors = settings.isDevelopment;

renderer.setPixelRatio(pixelRatio);
renderer.setScissorTest(true);
setRendererSize(renderer, window.innerWidth, window.innerHeight);

const gl = renderer.getContext();
const gpuInfo = gl.getExtension('WEBGL_debug_renderer_info');
const gpu = gl.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL);

if (settings.isDevelopment) console.log(`Graphics: ${getGraphicsMode()}\nGPU: ${gpu}\nTier: ${getTier()}`);

export default renderer;
