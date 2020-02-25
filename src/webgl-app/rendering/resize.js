import { Vector2 } from 'three';
import graphics from './graphics';
import { getGraphicsMode, FBO_FULL_SCREEN } from '../constants';

const { maxFrameBufferSize, pixelRatio } = graphics[getGraphicsMode()];

const baseSize = Math.sqrt(maxFrameBufferSize.x * maxFrameBufferSize.y);
const maxSize = baseSize * baseSize;

export const rendererSize = new Vector2();

export function getRenderBufferSize() {
  return {
    width: rendererSize.x * pixelRatio,
    height: rendererSize.y * pixelRatio
  };
}

function resize(windowWidth, windowHeight) {
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

export function setRendererSize(renderer: WebGLRenderer, windowWidth: Number, windowHeight: Number) {
  let { width, height } = resize(windowWidth, windowHeight);
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
