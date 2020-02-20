import graphics from './graphics';
import { getGraphicsMode } from '../constants';

const { maxFrameBufferSize } = graphics[getGraphicsMode()];

const baseSize = Math.sqrt(maxFrameBufferSize.x * maxFrameBufferSize.y);
const maxSize = baseSize * baseSize;

export default function(windowWidth, windowHeight) {
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
