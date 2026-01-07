import { sideLength, wgslNumStr as str, wgslVec3Str as strV, wgslIVec3Str as strIntV } from "../../../common"
import { shaderInputLayoutSrc } from "../inputLayout";
import { vec3 } from "wgpu-matrix"
import { smoothingRadius } from "../physics/sph";

// unit size of spatial grid. this is centred around 0, so will span [-0.5*bound, +0.5*bound]
// points outside the bounds will be modulo'd 
const bound = vec3.create(30, 30, 30); 


const gridSize = vec3.floor(vec3.divScalar(bound, smoothingRadius));
const trueBound = vec3.mulScalar(gridSize, smoothingRadius); // reduce bound to nearest multiple of smoothingRadius

console.log(strIntV(gridSize));
console.log(strV(trueBound));

export const assignCellShaderSrc = /* wgsl */`

${shaderInputLayoutSrc}

const gridSize = ${strIntV(gridSize)};
const bounds = ${strV(trueBound)};

const h = ${str(smoothingRadius)};

fn imod3(a: vec3<i32>, b: vec3<i32>) -> vec3<i32> {
  let r = a % b;
  return select(r + b, r, r >= vec3<i32>(0));
}

fn cellId(cellId3D: vec3<i32>) -> u32 {
  // TODO - could change loop for better spatial locality
  // e.g. if gridSize.x = 20, currently 21 =>  1, 22 =>  2, 41 => 1
  // but could flip this 20-40 range so 21 => 19, 22 => 18, 41 => 1
  let loopedId3D = imod3(cellId3D, gridSize);

  // TODO - use a space filling curve to improve neighbour locality
  let flatId =
    loopedId3D.x * gridSize.y * gridSize.z +
    loopedId3D.y * gridSize.z +
    loopedId3D.z;
  
  return u32(flatId);
}


@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;

  var position = particles[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / h));


  particles[id].cellIndex = cellId(cellId3D);
  
}

`;
