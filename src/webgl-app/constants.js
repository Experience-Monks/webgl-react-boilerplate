import profiler from './profiler';
import { getQueryFromParams } from './utils/query-params';

// Unlock full render size (should be false for prod)
export const FBO_FULL_SCREEN = false;

// Graphics mode constants
export const GRAPHICS_HIGH = 'high';
export const GRAPHICS_NORMAL = 'normal';
export const GRAPHICS_MODES = [GRAPHICS_HIGH, GRAPHICS_NORMAL];

let GRAPHICS_MODE = GRAPHICS_NORMAL;

if (GRAPHICS_MODES.includes(getQueryFromParams('graphics'))) {
  GRAPHICS_MODE = getQueryFromParams('graphics');
} else {
  GRAPHICS_MODE = profiler();
}

export function getGraphicsMode() {
  return GRAPHICS_MODE;
}
