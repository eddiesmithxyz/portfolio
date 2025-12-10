export const createCubeVerts = () => {
    return {
        positions: new Float32Array([
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0
        ]),

        indices: new Uint16Array([
            0, 1, 2,    0, 2, 3,    // front
            4, 5, 6,    4, 6, 7,    // back
            4, 5, 3,    4, 3, 0,    // left
            1, 6, 7,    1, 2, 6,    // right
            3, 2, 6,    3, 6, 5,    // top
            4, 7, 1,    4, 1, 0     // bottom
        ])
        

    };
}