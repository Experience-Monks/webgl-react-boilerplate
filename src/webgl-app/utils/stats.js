import settings from '../settings';
import RendererStats from './render-stats';

const rendererStats = new RendererStats();
if (settings.stats) {
  rendererStats.domElement.style.position = 'absolute';
  rendererStats.domElement.style.left = '0px';
  rendererStats.domElement.style.top = '48px';
  if (document.body) document.body.appendChild(rendererStats.domElement);
}

export { rendererStats };

if (settings.stats) {
  const stats = require('@jam3/stats')();
  stats.domElement.style.cssText = 'position:fixed;left:0;top:0;z-index:10000';
}
