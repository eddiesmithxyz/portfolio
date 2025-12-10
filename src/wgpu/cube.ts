export const createCubeData = () => {
  const positions = [
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
  ];
  const posIndices = [
    0, 1, 2,  0, 2, 3,  // front
    4, 5, 6,  4, 6, 7,  // back
    4, 5, 3,  4, 3, 0,  // left
    1, 6, 7,  1, 2, 6,  // right
    3, 2, 6,  3, 6, 5,  // top
    4, 7, 1,  4, 1, 0   // bottom
  ];
  

  const normals = [
    0, 0,  1, // front
    0, 0, -1, // back
    -1, 0, 0, // left
      1, 0, 0, // right
    0, -1, 0, // bottom
    0,  1, 0, // top
  ];
  const normalIndices = [
    0, 0, 0,  0, 0, 0, // front
    1, 1, 1,  1, 1, 1, // back
    2, 2, 2,  2, 2, 2, // left 
    3, 3, 3,  3, 3, 3, // right
    4, 4, 4,  4, 4, 4, // bottom
    5, 5, 5,  5, 5, 5  // top
  ];

  
  // use indices to generate explicit position array
  // indexed drawing is possible. but juggling different position and normal indices is difficult,
  // and no examples existed without passing all the data in as a uniform and having the indices as attributes
  const expandedPositions = new Float32Array(posIndices.length * 3);
  const expandedNormals = new Float32Array(normalIndices.length * 3);

  for (let i = 0; i < posIndices.length; i++) {
    const pi = posIndices[i];
    expandedPositions[i*3 + 0] = positions[pi*3 + 0];
    expandedPositions[i*3 + 1] = positions[pi*3 + 1];
    expandedPositions[i*3 + 2] = positions[pi*3 + 2];
  }
}