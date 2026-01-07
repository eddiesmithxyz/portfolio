
export const shaderInputLayoutSrc = /* wgsl */`

struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  lastDist: f32,
  density: f32,
  cellIndex: u32,
  _pad: f32,
}
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;

struct Uniforms {
  deltaTime: f32
}
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

`;