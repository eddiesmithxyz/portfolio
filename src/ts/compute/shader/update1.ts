import { shaderInputLayoutSrc, mainFunc, getID } from "./shaderLayout";
import { gridAccessFuncs } from "./grid/gridAccess";
import { sphSrc } from "./physics/sph";


// compute densities


export const update1Src = /* wgsl */`

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}


${mainFunc} {
  let id = ${getID};

  particles0[id].density = particleDensity(particles0[id]);
}

`;