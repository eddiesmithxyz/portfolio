import { wgslNumStr as str } from "../../../../common";

const mouseDisturbRadius = str(3);
const mouseDisturbSharpness = str(20);


export const mouseDistortSDFSrc = /* wgsl */`
fn sdMouseDistort(pos: vec3<f32>) -> f32 {
    // const sharpness = 0.9;
    // const period = 0.5;
    // return max((sin(period*abs(pos.y) + uniforms.time)-sharpness)/(1.0-sharpness), 0.0);


    // MOUSE INTERACTION

    // find closest point on line between mouseIntersection and lastMouseIntersection
    let p1 = uniforms.mouseDir;
    let p2 = uniforms.lastMouseDir;  
    
    let v = p2 - p1;
    let w = pos.xy - p1;

    let t = saturate(dot(w, v) / dot(v, v));
    let closestPoint = p1 + t*v;


    const mouseDisturbRadius = ${mouseDisturbRadius};
    const mouseDisturbSharpness = ${mouseDisturbSharpness};

    var dist = pos.xy - closestPoint;
    dist *= 1.0/mouseDisturbRadius;
    

    return mouseDisturbSharpness*exp(-dot(dist, dist));
}



`;