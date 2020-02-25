import profiler from './rendering/profiler';
import { getQueryFromParams } from './utils/query-params';

// Unlock full render size (should be false for prod)
export const FBO_FULL_SCREEN = false;

// Graphics mode constants
export const GRAPHICS_HIGH = 'high';
export const GRAPHICS_NORMAL = 'normal';
export const GRAPHICS_MODES = [GRAPHICS_HIGH, GRAPHICS_NORMAL];

let GRAPHICS_MODE = GRAPHICS_NORMAL;

// If the graphics query parameter is set, use it over the current gpu tier
if (GRAPHICS_MODES.includes(getQueryFromParams('graphics'))) {
  GRAPHICS_MODE = getQueryFromParams('graphics');
} else {
  GRAPHICS_MODE = profiler();
}

/**
 * Get the current graphics mode
 *
 * @export
 * @returns
 */
export function getGraphicsMode() {
  return GRAPHICS_MODE;
}

// GUI Number precision
export const GUI_PRECISION = 0.001;

// Viewport preview scale (when using devCamera)
export const VIEWPORT_PREVIEW_SCALE = 0.25;
