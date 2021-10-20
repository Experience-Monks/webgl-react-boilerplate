import { WebGLRenderer } from 'three';
// import graphics, { getGraphicsMode, getTier } from './graphics';
import settings from '../settings';
import graphics, { graphicsConfig } from './graphics';

const { pixelRatio, antialias } = graphicsConfig[graphics.mode];

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

export default renderer;
