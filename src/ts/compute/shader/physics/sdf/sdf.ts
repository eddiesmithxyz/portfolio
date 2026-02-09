import { wgslNumStr as str } from "../../../../common";
import { mouseDistortSDFSrc } from "./mouseDistort";
import { wordSDFSrc } from "./word";

const mass = str(0.05);
const positionStiffness = str(-1.8);
const velocityDamping = str(-1.3);
const gravityClamp = str(400); // limit gravity so it doesn't explode if we're far away

export const sdfSrc = /* wgsl */`
${wordSDFSrc}
${mouseDistortSDFSrc}

fn sdf(pos: vec3<f32>) -> f32 {
    var dist = sdfWord(pos);
    dist += sdMouseDistort(pos);

    return dist;
}

const EPSILON: f32 = 0.0001;
fn sdfNormal(pos: vec3<f32>) -> vec3<f32> {
    let e = vec3<f32>(EPSILON, 0.0, 0.0);

    let dx = sdf(pos + e.xyy) - sdf(pos - e.xyy);
    let dy = sdf(pos + e.yxy) - sdf(pos - e.yxy);
    let dz = sdf(pos + e.yyx) - sdf(pos - e.yyx);

    return normalize(vec3<f32>(dx, dy, dz));
}

const gravityClamp = ${gravityClamp};
fn gravityAccel(pos: vec3<f32>, dist: f32, fieldNormal: vec3<f32>, lastDist: f32) -> vec3<f32> {
  var dist2 = dist; // max(dist, 0.0);         // uncomment to allow particles inside volumes
  var lastDist2 = lastDist; // max(lastDist, 0.0);

//   const stableDistRange = 2.0; // not actually scene units
//   let u = dist2/stableDistRange;
//   dist2 *= 1.0 - exp(-(u*u));

  let dDistdt = (dist2 - lastDist2) / uniforms.deltaTime;
  var gravityAmount = -${positionStiffness}*dist2 - ${velocityDamping}*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  var gravity = -fieldNormal * gravityAmount;

  return gravity / ${mass};

}


`;