// PI constant
export const PI = `
  #define PI 3.14159265359
`;

/* Taken from threejs common.glsl */
export const rand = `
  highp float rand( const in vec2 uv ) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
    return fract(sin(sn) * c);
  }
`;
