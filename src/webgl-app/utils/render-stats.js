import { WebGLRenderer } from 'three';
import settings from '../settings';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */

/**
 * Provide info on THREE.WebGLRenderer
 *
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 */
const RendererStats = function() {
  const container = document.createElement('div');
  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer;z-index:100000;top:48px;position:absolute;';

  const msDiv = document.createElement('div');
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:rgb(0, 0, 0);';
  container.appendChild(msDiv);

  const msText = document.createElement('div');
  msText.style.cssText =
    'color:rgb(255, 255, 255);font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'WebGLRenderer';
  msDiv.appendChild(msText);

  const msTexts = [];
  const nLines = 9;
  for (var i = 0; i < nLines; i++) {
    msTexts[i] = document.createElement('div');
    msTexts[i].style.cssText =
      'color:rgb(255, 255, 255);background-color:rgb(0, 0, 0);font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    msDiv.appendChild(msTexts[i]);
    msTexts[i].innerHTML = '-';
  }

  let lastTime = Date.now();
  return {
    domElement: container,

    update: function(webglRenderer: WebGLRenderer) {
      // sanity check
      console.assert(webglRenderer instanceof WebGLRenderer);

      // refresh only 30time per second
      if (Date.now() - lastTime < 1000 / 30) return;
      lastTime = Date.now();

      msTexts[0].textContent = '=== Memory ===';
      msTexts[1].textContent = 'Programs: ' + webglRenderer.info.programs.length;
      msTexts[2].textContent = 'Geometries: ' + webglRenderer.info.memory.geometries;
      msTexts[3].textContent = 'Textures: ' + webglRenderer.info.memory.textures;
      msTexts[4].textContent = '=== Render ===';
      msTexts[5].textContent = 'Calls: ' + webglRenderer.info.render.calls;
      msTexts[6].textContent = 'Triangles: ' + webglRenderer.info.render.triangles;
      msTexts[7].textContent = 'Lines: ' + webglRenderer.info.render.lines;
      msTexts[8].textContent = 'Points: ' + webglRenderer.info.render.points;
    }
  };
};

export function RenderStatsWrapper() {
  return {
    domElement: document.createElement('div'),
    update: (renderer: WebGLRenderer) => {}
  };
}

const Cls = settings.isDevelopment ? RendererStats : RenderStatsWrapper;

export default Cls;
