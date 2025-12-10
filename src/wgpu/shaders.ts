const shaders = /* wgsl */`
struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) colour : vec4f
}

@group(0) @binding(0) var<uniform> modelViewProjectionMatrix : mat4x4<f32>;

@vertex
fn vertex_main(@location(0) position : vec4f) -> VertexOut {
    var output : VertexOut;

    output.position = modelViewProjectionMatrix * position;
    output.colour = vec4f(0.4, 0.6, 0.8, 1.0);

    return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
    return fragData.colour;
}

`;


export { shaders };