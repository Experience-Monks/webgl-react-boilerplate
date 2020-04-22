import { getQueryFromParams } from './utils/query-params';

const settings = {};

// Enviroment setting
settings.isDevelopment = process.env.NODE_ENV !== 'production';

// Base url
settings.baseUrl = process.env.PUBLIC_URL || '';

// Show fps stats
settings.stats = getQueryFromParams('stats') === null;

// Enable dev camera rendering
settings.devCamera = getQueryFromParams('devCamera') === 'true';

// Enable helpers
settings.helpers = getQueryFromParams('helpers') === 'true';

// Enable dat gui
settings.datGui = getQueryFromParams('gui') === null;

// Skips all transitions
settings.skipTransitions = getQueryFromParams('skipTransitions') === null;

// GUI Number precision
settings.guiPrecision = 0.001;

// Viewport preview scale (when using devCamera)
settings.viewportPreviewScale = 0.25;

// Unlock full render size (should be false for prod)
settings.renderBufferFullscreen = false;

export default settings;
