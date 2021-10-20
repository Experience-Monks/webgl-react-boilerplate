import { Vector2, WebGLRenderer } from 'three';
import graphics, { graphicsConfig } from './graphics';
import settings from '../settings';

export const rendererSize = new Vector2();

export function getRenderBufferSize(): { width: number, height: number } {
  const { pixelRatio } = graphicsConfig[graphics.tier];
  return {
    width: rendererSize.x * pixelRatio,
    height: rendererSize.y * pixelRatio
  };
}

function resize(windowWidth: number, windowHeight: number): { width: number, height: number } {
  const { maxFrameBufferSize } = graphicsConfig[graphics.mode];
  const baseSize = Math.sqrt(maxFrameBufferSize.x * maxFrameBufferSize.y);
  const maxSize = baseSize * baseSize;
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

export function setRendererSize(renderer: WebGLRenderer, windowWidth: number, windowHeight: number) {
  let { width, height } = resize(windowWidth, windowHeight);
  if (settings.renderBufferFullscreen) {
    width = windowWidth;
    height = windowHeight;
  }
  rendererSize.x = width;
  rendererSize.y = height;
  renderer.setSize(width, height);
  renderer.domElement.style.width = `${windowWidth}px`;
  renderer.domElement.style.height = `${windowHeight}px`;
}
