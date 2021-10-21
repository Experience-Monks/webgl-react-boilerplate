import { getGPUTier } from 'detect-gpu';
import { Vector2 } from 'three';
import math from '../utils/math';
import { getQueryFromParams } from '../utils/query-params';

export const GRAPHICS_HIGH = 'high';
export const GRAPHICS_NORMAL = 'normal';
export const GRAPHICS_MODES = [GRAPHICS_HIGH, GRAPHICS_NORMAL];

const graphicsConfig = {
  [GRAPHICS_HIGH]: {
    antialias: true,
    pixelRatio: math.clamp(window.devicePixelRatio, 1, 2),
    maxFrameBufferSize: new Vector2(1920, 1080)
  },
  [GRAPHICS_NORMAL]: {
    antialias: true,
    pixelRatio: 1,
    maxFrameBufferSize: new Vector2(1280, 720)
  }
};

class Graphics {
  mode: string = GRAPHICS_NORMAL;
  tier: string = '';
  gpuTier: { tier: string, type: string };

  async run() {
    this.gpuTier = await getGPUTier();
    this.tier = this.gpuTier.tier;

    // If the graphics query parameter is set, use it over the current gpu tier
    const graphicsMode = getQueryFromParams('graphics');
    if (GRAPHICS_MODES.includes(graphicsMode) && typeof graphicsMode === 'string') {
      this.mode = graphicsMode;
    } else {
      this.mode = this.getGraphics();
    }
  }

  getGraphics() {
    switch (this.gpuTier.tier) {
      case 'GPU_DESKTOP_TIER_3':
      case 'GPU_DESKTOP_TIER_2':
      case 'GPU_MOBILE_TIER_3':
        return GRAPHICS_HIGH;
      case 'GPU_DESKTOP_TIER_1':
      default:
        return GRAPHICS_NORMAL;
    }
  }
}

export default new Graphics();
export { graphicsConfig };
