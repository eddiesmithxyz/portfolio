import {WGPUrenderer} from "./wgpu/render/renderer.ts"
import { createSquareData } from "./wgpu/render/square.ts";
import { Scene } from "./scene/scene.ts";
import { mat4 } from "wgpu-matrix";


const scene = new Scene();

let lastTime = Date.now();

function render(renderer: WGPUrenderer) {
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  scene.update(deltaTime);

  const projMatrix = mat4.perspective(
    2.0,
    renderer.ctx.canvas.width / renderer.ctx.canvas.height,
    0.1,
    1000.0
  );
  renderer.render(scene.instanceData, mat4.multiply(projMatrix, scene.viewMatrix));
  requestAnimationFrame(() => render(renderer));
}


async function main() {
  const renderer = new WGPUrenderer();

  const success = await renderer.init()
  if (!success) 
    return;
    

  (window as any).renderer = renderer; // debug


  const vertData = createSquareData();
  renderer.createBuffersAndPipeline(vertData, scene.instanceCount);

  lastTime = Date.now();
  requestAnimationFrame(() => render(renderer));
}

main()