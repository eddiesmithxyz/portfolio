import { shaderInputLayoutSrc, mainFunc, getID } from "./shaderLayout";
import { gridAccessFuncs } from "./grid/gridAccess";
import { sdfSrc } from "./physics/sdf";
import { sphSrc } from "./physics/sph";


// compute pressure and viscosity forces

export const update2Src = /* wgsl */`

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}
${sdfSrc}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion


${mainFunc} {
  let id = ${getID};
  let particle = particles[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;


  // field gravity
  let fieldDist = sdf(position);
  let fieldNormal = sdfNormal(position);
  var acceleration = gravityAccel(position, fieldDist, fieldNormal, particle.lastDist);
  particles[id].lastDist = fieldDist;

  // fluid force
  acceleration += fluidAccel(particle, id);

  // apply forces
  velocity += acceleration * accelDeltaTime;
  position += velocity * uniforms.deltaTime * uniforms.animSpeed;


  // particle normal - move towards field normal
  const lerpSpeed = 0.1;
  let newNormal = normalize(lerpSpeed*fieldNormal + (1.0-lerpSpeed)*particle.normal.xyz);
  particles[id].normal = vec4<f32>(newNormal, 1.0);




  particles[id].position = vec4<f32>(position.xyz, 1.0);
  particles[id].velocity = vec4<f32>(velocity.xyz, 1.0);
}
`;