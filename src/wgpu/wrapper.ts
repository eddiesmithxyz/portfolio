import { shaders } from "./shaders.ts";
import { createCubeVerts } from "./cube.ts";

import { mat4 } from 'wgpu-matrix';

export class WGPU {
  private device: GPUDevice = {} as GPUDevice;
  private ctx: GPUCanvasContext = {} as GPUCanvasContext;
  private renderPipeline: GPURenderPipeline = {} as GPURenderPipeline; 
  private commandEncoder: GPUCommandEncoder = {} as GPUCommandEncoder;

  
  async init(): Promise<boolean> {
    if (!navigator.gpu) {
      throw Error("WebGPU not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.");
    }


    this.device = await adapter.requestDevice();

    const shaderModule = this.device.createShaderModule({
      code: shaders
    })

    const canvas = document.querySelector("#gpuCanvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("webgpu") as GPUCanvasContext;

    this.ctx.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque"
    });


    const vertBufferLayouts = [
      {
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x3"
          }
        ],
        arrayStride: 12,
        stepMode: "vertex"
      } as GPUVertexBufferLayout
    ];

    this.renderPipeline = this.device.createRenderPipeline({
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: vertBufferLayouts
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
      },
      primitive: {
        topology: "triangle-list"
      },
      layout: "auto"
    });

    this.commandEncoder = this.device.createCommandEncoder();

    return true;
  }


  render() {
    const { positions, indices } = createCubeVerts();

    const vertexBuffer = this.device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(vertexBuffer, 0, positions, 0, positions.length);

    const indexBuffer = this.device.createBuffer({
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(indexBuffer, 0, indices, 0, indices.length);



    const uniformBuffer = this.device.createBuffer({
      size: 16*4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const rotationMatrix = mat4.multiply(mat4.rotationY(1), mat4.rotationX(1.5));
    const translationMatrix = mat4.translation([0, 0, -4]);
    const modelMatrix = mat4.multiply(translationMatrix, rotationMatrix);
    const viewProjectionMatrix = mat4.perspective(
      2.0,
      this.ctx.canvas.width / this.ctx.canvas.height,
      0.1,
      100.0
    );
    const modelViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, modelMatrix);
    this.device.queue.writeBuffer(uniformBuffer, 0, modelViewProjectionMatrix as Float32Array<ArrayBuffer>, 0, 16);
    
    const bindGroup = this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer }},
      ],
    });



    const passEncoder = this.commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
          loadOp: "clear",
          storeOp: "store",
          view: this.ctx.getCurrentTexture().createView()
        }
      ]
    });

    passEncoder.setPipeline(this.renderPipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, "uint16");
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.drawIndexed(indices.length)

    passEncoder.end();
    this.device.queue.submit([this.commandEncoder.finish()]);
  }
}