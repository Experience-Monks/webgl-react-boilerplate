import { getQueryFromParams } from './utils/query-params';

const settings = {};

// Enviroment setting
settings.isDevelopment = process.env.NODE_ENV !== 'production';

// Show fps stats
settings.stats = getQueryFromParams('stats') === null && settings.isDevelopment;

// Enable dev camera rendering
settings.devCamera = getQueryFromParams('devCamera') === 'true' && settings.isDevelopment;

// Enable helpers
settings.helpers = getQueryFromParams('helpers') === 'true' && settings.isDevelopment;

// Enable dat gui
settings.datGui = getQueryFromParams('gui') === null && settings.isDevelopment;

// Skips all transitions
settings.skipTransitions = getQueryFromParams('skipTransitions') === null && settings.isDevelopment;

export default settings;
