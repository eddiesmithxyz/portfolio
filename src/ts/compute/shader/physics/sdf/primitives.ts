export const primitiveSDFsSrc = /* wgsl */`
fn sdSphere(p: vec3<f32>, r: f32) -> f32 {
    return length(p) - r;
}

fn sdCapsule(p: vec3<f32>, a: vec3<f32>, b: vec3<f32>, r: f32) -> f32 {
    let pa = p - a;
    let ba = b - a;
    let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

fn sdCappedTorusRight(pIn: vec3<f32>, sc: vec2<f32>, ra: f32, rb: f32) -> f32 {
    var p = pIn;
    p.y = abs(p.y);

    let p_xy = p.xy;
    let k = select(
        length(p_xy),
        dot(p_xy, sc),
        sc.y * p.y > sc.x * p.x
    );

    return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}
fn sdCappedTorusTop(
    p_in: vec3<f32>,
    sc: vec2<f32>,
    ra: f32,
    rb: f32
) -> f32 {
    var p = p_in;
    p.x = abs(p.x);

    let k = select(
        length(p.xy),
        dot(p.xy, sc),
        sc.y * p.x > sc.x * p.y
    );

    return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

`;