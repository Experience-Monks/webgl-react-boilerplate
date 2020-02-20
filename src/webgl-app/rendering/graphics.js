import { Vector2 } from 'three';
import { GRAPHICS_NORMAL, GRAPHICS_HIGH } from '../constants';
import math from '../utils/math';

export default {
  [GRAPHICS_HIGH]: {
    antialias: true,
    pixelRatio: math.clamp(window.devicePixelRatio, 1, 2),
    maxFrameBufferSize: new Vector2(1280, 720)
  },
  [GRAPHICS_NORMAL]: {
    antialias: true,
    pixelRatio: 1,
    maxFrameBufferSize: new Vector2(960, 540)
  }
};
