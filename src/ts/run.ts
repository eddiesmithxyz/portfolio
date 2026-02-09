import {WGPURenderer} from "./render/renderer.ts"
import { WGPUComputer } from "./compute/computer.ts"
import { Scene } from "./scene.ts";
import { workgroupSize, type SimParams } from "./common.ts";
export { type SimParams }



const defaultParams: Required<SimParams> = {
  particleCount: workgroupSize * 1024,
  particleSize: 1.6,

  backgroundColour: [0.1, 0.1, 0.1],
  col1: [0.3, 0.7, 0.8],
  col2: [0.0, 0.3, 0.8],

  viewDist: 84,

  allowScroll: true,
  autoResize: true
};




let scene: Scene;

let lastTime = Date.now();
let frameCount = 0;
let frameTimeSum = 0;
function render(renderer: WGPURenderer, computer: WGPUComputer) {
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  frameCount++;
  frameTimeSum += deltaTime;
  if (window.LOG_FPS && frameCount % 100 == 0) {
    console.log("FPS ", 1 / (frameTimeSum / 100))
    frameTimeSum = 0;
  }
  


  scene.update(renderer.ctx.canvas as HTMLCanvasElement, deltaTime);

  computer.run(Math.min(deltaTime, 0.1), scene);
  renderer.render(scene.viewProjectionMatrix, scene.camPos);
  requestAnimationFrame(() => render(renderer, computer));
}


let running = false;
export async function runSim(canvas: HTMLCanvasElement, params: SimParams | undefined = undefined) {
  if (running) return;
  running = true;

  let finalParams = {
    ...defaultParams,
    ...params
  }

  // particle count must be a multiple of workgroup size
  finalParams.particleCount = Math.floor(finalParams.particleCount / workgroupSize + 0.1) * workgroupSize;

  scene = new Scene(canvas, finalParams);

  const renderer = new WGPURenderer();
  const success = await renderer.init(canvas)
  if (!success) 
    return;


  // resize oberserver
  if (finalParams.autoResize) {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentBoxSize[0].inlineSize;
        const height = entry.contentBoxSize[0].blockSize;
        const canvas = entry.target as HTMLCanvasElement;
        canvas.width = Math.max(1, Math.min(width, renderer.device.limits.maxTextureDimension2D));
        canvas.height = Math.max(1, Math.min(height, renderer.device.limits.maxTextureDimension2D));
      }
    });
    observer.observe(renderer.canvas);
  }


  const particleData = scene.createInitialParticleData(finalParams.particleCount!);
  renderer.createBuffersAndPipeline(finalParams);
  const computer = new WGPUComputer(renderer.device, finalParams.particleCount, particleData, renderer.instanceBuffer);

  

  lastTime = Date.now();
  requestAnimationFrame(() => render(renderer, computer));
}