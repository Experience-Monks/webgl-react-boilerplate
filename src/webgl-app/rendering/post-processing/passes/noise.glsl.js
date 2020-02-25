export const uniforms = {
  noiseSpeed: { value: 0.18 },
  time: { value: 0 },
  noiseAmount: { value: 0.3 }
};

export const fragmentUniforms = `
  uniform float noiseSpeed;
  uniform float noiseAmount;

  float random( vec2 p ) {
    vec2 K1 = vec2(
      23.14069263277926, // e^pi (Gelfond's constant)
      2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
  }
`;

export const fragmentMain = `
  vec2 uvRandom = uv;
  uvRandom.y *= random(vec2(uvRandom.y, (time * 0.001) * noiseSpeed));
  outgoingColor.rgb += random(uvRandom) * noiseAmount;
`;
