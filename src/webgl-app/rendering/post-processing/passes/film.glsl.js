import { rand, PI } from '../../../shaders/math.glsl';

export const uniforms = {
  time: { value: 0 },
  	filmNoiseIntensity: { value: 0.35 },
		filmScanIntensity: { value: 0.05 },
		filmScanCount: { value: 4096 },
		filmGrayscale: { value: 0 }
};

export const fragmentUniforms = `
  uniform bool filmGrayscale;
  uniform float filmNoiseIntensity;
  uniform float filmScanIntensity;
  uniform float filmScanCount;
  ${PI}
  ${rand}
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
export const fragmentMain = `
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

  outgoingColor.rgb = cResult;
`;

export function guiControls(gui, material) {
  const guiFilm = gui.addFolder('film pass');
  guiFilm.open();
  guiFilm.add(material.uniforms.filmNoiseIntensity, 'value', 0, 1).name('noise intensity');
  guiFilm.add(material.uniforms.filmScanIntensity, 'value', 0, 1).name('scan intensity');
  guiFilm.add(material.uniforms.filmScanCount, 'value', 0, 4096).name('scan count');
  guiFilm.add(material.uniforms.filmGrayscale, 'value', 0, 1, 1).name('gayscale');
}
