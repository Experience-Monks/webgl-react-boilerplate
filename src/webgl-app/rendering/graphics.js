import { Vector2 } from 'three';
import { GRAPHICS_NORMAL, GRAPHICS_HIGH } from '../constants';
import math from '../utils/math';

export default {
  [GRAPHICS_HIGH]: {
    antialias: false, // Enable antialias if you're not using post processing
    pixelRatio: math.clamp(window.devicePixelRatio, 1, 2),
    maxFrameBufferSize: new Vector2(1280, 720)
  },
  [GRAPHICS_NORMAL]: {
    antialias: false,
    pixelRatio: 1,
    maxFrameBufferSize: new Vector2(1280, 720)
  }
};
