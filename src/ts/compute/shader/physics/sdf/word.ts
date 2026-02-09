import { letterSDFsSrc } from "./letters";

export const wordSDFSrc = /* wgsl */`
${letterSDFsSrc}

fn sdfEddie(p: vec3<f32>) -> f32 {
    const r: f32 = 0.08;
    const scale: f32 = 40.0;
    let pos = p / scale;

    var minDist: f32 = 1e20;
    
    // E
    minDist = min(minDist, sdE(pos - vec3<f32>(-2.05, 0.0, 0.0), r) * scale);

    // D D
    minDist = min(minDist, sdD(pos - vec3<f32>(-1.05, 0.0, 0.0), r) * scale);
    minDist = min(minDist, sdD(pos - vec3<f32>( 0.0, 0.0,  0.0), r) * scale);

    // I
    minDist = min(minDist, sdI(pos - vec3<f32>( 1.0, 0.0, 0.0), r) * scale);

    // E
    minDist = min(minDist, sdE(pos - vec3<f32>( 2.0, 0.0, 0.0), r) * scale);


    return minDist;
}


fn sdfEdSmall(p: vec3<f32>) -> f32 {
    const r: f32 = 0.08;
    const scale: f32 = 40.0;
    let pos = p / scale;

    var minDist: f32 = 1e20;
    
    // E
    minDist = min(minDist, sdE(pos - vec3<f32>(-0.5, 0.0, 0.0), r) * scale);

    // D
    minDist = min(minDist, sdD(pos - vec3<f32>(0.5, 0.0, 0.0), r) * scale);


    return minDist;
}


fn sdfHi(p: vec3<f32>) -> f32 {
    const r: f32 = 0.08;
    const scale: f32 = 60.0;
    let pos = p / scale;

    var minDist: f32 = 1e20;
    

    

    // H
    minDist = min(minDist, sdH(pos - vec3<f32>(-0.5, 0.0, 0.0), r) * scale);

    // I
    minDist = min(minDist, sdI(pos - vec3<f32>( 0.5, 0.0, 0.0), r) * scale);



    return minDist;


}

fn sdhi(p: vec3<f32>) -> f32 {
    // const r: f32 = 0.08;
    const r: f32 = 0.05;
    const scale: f32 = 60.0;
    let pos = p / scale;

    var minDist: f32 = 1e20;

    // h
    minDist = min(minDist, sdh(pos - vec3<f32>(-0.7, 0.0, 0.0), r) * scale);

    // i
    minDist = min(minDist, sdi(pos - vec3<f32>(0.0, 0.0, 0.0), r) * scale);

    // !
    minDist = min(minDist, sdExclamation(pos - vec3<f32>(0.5, 0.0, 0.0), r) * scale);

    return minDist;

}


fn sdfWord(p: vec3<f32>) -> f32 { 
//   return sdfEdSmall(p);
  return sdfEddie(p);
}

`;