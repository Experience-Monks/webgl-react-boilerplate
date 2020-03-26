import { GUI } from 'dat.gui';
import { Material } from 'three';
import { rand, PI } from '../../../shaders/math.glsl';

export const uniforms = {
  filmEnabled: { value: 1 },
  filmNoiseIntensity: { value: 0.35 },
  filmScanIntensity: { value: 0.05 },
  filmScanCount: { value: 4096 },
  filmGrayscale: { value: 0 }
};

export const fragmentUniforms = `
  uniform bool filmEnabled;
  uniform bool filmGrayscale;
  uniform float filmNoiseIntensity;
  uniform float filmScanIntensity;
  uniform float filmScanCount;
`;

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 */

export const fragmentPass = `
  ${PI}
  ${rand}

  vec3 filmPass(vec3 outgoingColor, vec2 uv) {
    // Make some noise
    float dx = rand(uv + time);

    // Add noise
    vec3 cResult = outgoingColor.rgb + outgoingColor.rgb * clamp(0.1 + dx, 0.0, 1.0);

    // Get us a sine and cosine
    vec2 sc = vec2(sin(uv.y * filmScanCount), cos(uv.y * filmScanCount));

    // Add scanlines
    cResult += outgoingColor.rgb * vec3(sc.x, sc.y, sc.x) * filmScanIntensity;

    // Interpolate between source and result by intensity
    cResult = outgoingColor.rgb + clamp(filmNoiseIntensity, 0.0,1.0) * (cResult - outgoingColor.rgb);

    // Convert to grayscale if desired
    if (filmGrayscale) {
      cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );
    }

    return cResult;
  }
`;

export const fragmentMain = `
  // Film pass start
  if (filmEnabled) {
    outgoingColor.rgb = filmPass(outgoingColor.rgb, uv);
  }
  // Film pass end
`

export function guiControls(gui: GUI, material: Material) {
  const guiPass = gui.addFolder('film pass');
  guiPass.open();
  guiPass.add(material.uniforms.filmEnabled, 'value', 0, 1, 1).name('enabled');
  guiPass.add(material.uniforms.filmNoiseIntensity, 'value', 0, 1).name('noise intensity');
  guiPass.add(material.uniforms.filmScanIntensity, 'value', 0, 1).name('scan intensity');
  guiPass.add(material.uniforms.filmScanCount, 'value', 0, 4096).name('scan count');
  guiPass.add(material.uniforms.filmGrayscale, 'value', 0, 1, 1).name('gayscale');
}
