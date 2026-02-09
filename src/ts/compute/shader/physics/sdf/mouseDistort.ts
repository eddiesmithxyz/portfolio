import { wgslNumStr as str } from "../../../../common";

const mouseDisturbRadius = 3;
const mouseDisturbSharpness = str(20);


const sqDistMultipler = str(Math.pow(1/mouseDisturbRadius, 2));

export const mouseDistortSDFSrc = /* wgsl */`

fn sdMouseWedgeSq(p: vec3<f32>, eye: vec3<f32>, m0: vec3<f32>, m1: vec3<f32>) -> f32 {
  // https://www.shadertoy.com/view/w33fDH
  
  var ep = p - eye;

  var n = cross(m0, m1);
  if (length(n) < 0.0001) { // vectors are the same
    // replace m0/m1 plane with ep/m0 plane
    // this will make point-to-plane distance 0, and the point-to-ray distance will be calculated by the second part.
    n = cross(ep, m0); 
  }
  n = normalize(n);

  let sdistToPlane = dot(ep, n);


  // distance from plane-projected point to wedge
  let p2 = p - sdistToPlane*n;

  ep = p2 - eye;
  let epM0 = dot(ep, m0);
  let epM1 = dot(ep, m1);

  let closerLine = select(m0, m1, epM0 < epM1);
  let pm = max(0., max(epM0, epM1))*closerLine + eye;
  let lineDist = distance(p2, pm);

  let m05 = .5*(m0 + m1);
  let inWedge = sign(dot(m0, m05) - dot(normalize(ep), m05));
  let onPlaneDist = max(0., lineDist * inWedge);

  let distVec = vec2<f32>(abs(sdistToPlane), onPlaneDist);
  return dot(distVec, distVec);

}



fn sdMouseDistort(pos: vec3<f32>) -> f32 {
    var sqDist = sdMouseWedgeSq(pos, uniforms.camPos.xyz, uniforms.mouseDir.xyz, uniforms.lastMouseDir.xyz);
    // var sqDist = sdMouseWedgeSq(pos, vec3f(0.0, 0.0, -100.0), normalize(vec3f(-1.0, 0.0, 1.0)), normalize(vec3f(1.0, 0.0, 1.0)));
    sqDist *= ${sqDistMultipler};
    

    return ${mouseDisturbSharpness}*exp(-sqDist);
}



`;