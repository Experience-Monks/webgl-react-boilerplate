import { getGPUTier } from 'detect-gpu';
import { Vector2 } from 'three';
import math from '../utils/math';
import { getQueryFromParams } from '../utils/query-params';

// Graphics mode constants
export const GRAPHICS_HIGH = 'high';
export const GRAPHICS_NORMAL = 'normal';
export const GRAPHICS_MODES = [GRAPHICS_HIGH, GRAPHICS_NORMAL];

let GRAPHICS_MODE = GRAPHICS_NORMAL;

/**
 * Get the current graphics mode
 *
 * @export
 * @returns
 */
export function getGraphicsMode(): string {
  return GRAPHICS_MODE;
}

const gpuTier = getGPUTier();

export function profiler(): string {
  switch (gpuTier.tier) {
    case 'GPU_DESKTOP_TIER_3':
    case 'GPU_DESKTOP_TIER_2':
    case 'GPU_MOBILE_TIER_3':
      return GRAPHICS_HIGH;
    case 'GPU_DESKTOP_TIER_1':
    default:
      return GRAPHICS_NORMAL;
  }
}

// If the graphics query parameter is set, use it over the current gpu tier
const graphicsMode = getQueryFromParams('graphics');
if (GRAPHICS_MODES.includes(graphicsMode) && typeof graphicsMode === 'string') {
  GRAPHICS_MODE = graphicsMode;
} else {
  GRAPHICS_MODE = profiler();
}

export function getTier(): string {
  return gpuTier.tier;
}

// Graphics settings for the renderer
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
