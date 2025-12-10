import { shaders } from "./shaders.ts";
import { mat4 } from 'wgpu-matrix';

export class WGPU {
  private device: GPUDevice = {} as GPUDevice;
  private ctx: GPUCanvasContext = {} as GPUCanvasContext;
  private renderPipeline: GPURenderPipeline = {} as GPURenderPipeline; 


  private vertexCount: number = 0;

  private vertexBuffer: GPUBuffer = {} as GPUBuffer;
  private indexBuffer: GPUBuffer = {} as GPUBuffer;
  private uniformBuffer: GPUBuffer = {} as GPUBuffer;
  private bindGroup: GPUBindGroup = {} as GPUBindGroup;

  public clearColour = { r: 0.1, g: 0.1, b: 0.1, a: 1 };
  
  async init(): Promise<boolean> {
    if (!navigator.gpu) {
      throw Error("WebGPU not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.");
    }


    this.device = await adapter.requestDevice();

    const canvas = document.querySelector("#gpuCanvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("webgpu") as GPUCanvasContext;

    this.ctx.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque"
    });

    return true;
  }

  createBuffersAndPipeline(data: 
    {
      positions: Float32Array<ArrayBuffer>,
      normals: Float32Array<ArrayBuffer>
    }
    ) 
  {
    const { positions, normals } = data;

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

    const shaderModule = this.device.createShaderModule({code: shaders});
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


    // FILL BUFFERS
    this.vertexBuffer = this.device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, positions, 0, positions.length);

    

    this.vertexCount = positions.length / 3;


    
    this.uniformBuffer = this.device.createBuffer({
      size: 16*4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    
    this.bindGroup = this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer }},
      ],
    });

  }


  render() {
    const rotationMatrix = mat4.multiply(mat4.rotationY(Date.now() * 0.001), mat4.rotationX(1.5));
    const translationMatrix = mat4.translation([0, 0, -4]);
    const modelMatrix = mat4.multiply(translationMatrix, rotationMatrix);
    const viewProjectionMatrix = mat4.perspective(
      2.0,
      this.ctx.canvas.width / this.ctx.canvas.height,
      0.1,
      100.0
    );
    const modelViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, modelMatrix);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, modelViewProjectionMatrix as Float32Array<ArrayBuffer>, 0, 16);
    



    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          clearValue: this.clearColour,
          loadOp: "clear",
          storeOp: "store",
          view: this.ctx.getCurrentTexture().createView()
        }
      ]
    });

    passEncoder.setPipeline(this.renderPipeline);
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.draw(this.vertexCount);

    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}