import { mat4, vec3, vec2, quat, type Quat, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';

function sdCapsule(p: Vec3, a: Vec3, b: Vec3, r: number): number {
  const pa = vec3.subtract(p, a);
  const ba = vec3.subtract(b, a);
  const h = Math.max(0, Math.min(1, vec3.dot(pa, ba) / vec3.dot(ba, ba)));
  return vec3.length(vec3.subtract(pa, vec3.scale(ba, h))) - r;
}

function sdE(p: Vec3, r: number): number {
  const c1 = sdCapsule(p, vec3.create(-0.3,  0.5, 0), vec3.create(0.3,  0.5, 0), r);
  const c2 = sdCapsule(p, vec3.create(-0.3,    0, 0), vec3.create(0.3,    0, 0), r);
  const c3 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(0.3, -0.5, 0), r);
  const c4 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(-0.3, 0.5, 0), r);
  
  return Math.min(Math.min(c1, c2), Math.min(c3, c4));
}

function sdf(pos: Vec3): number {
  // SPHERE
  // const radius = 10;
  // return pos.length - radius;

  const scale = 40;
  return sdE(vec3.scale(pos, 1 / scale), 0.05) * scale;
}



const epsilon = 0.0001;
const epsXPos = vec3.create(epsilon, 0, 0);
const epsYPos = vec3.create(0, epsilon, 0);
const epsZPos = vec3.create(0, 0, epsilon);
const epsXNeg = vec3.create(-epsilon, 0, 0);
const epsYNeg = vec3.create(0, -epsilon, 0);
const epsZNeg = vec3.create(0, 0, -epsilon);
function sdfNormal(pos: Vec3): Vec3 {
  // SPHERE
  // return vec3.normalize(pos);


  // sdf gradient by central differences

  const dx = sdf(vec3.add(pos, epsXPos)) - sdf(vec3.add(pos, epsXNeg));
  const dy = sdf(vec3.add(pos, epsYPos)) - sdf(vec3.add(pos, epsYNeg));
  const dz = sdf(vec3.add(pos, epsZPos)) - sdf(vec3.add(pos, epsZNeg));

  return vec3.normalize(vec3.create(dx, dy, dz));
}
export { sdf, sdfNormal };