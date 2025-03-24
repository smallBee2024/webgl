
/**
 * 加载着色器
 * @param {*} gl 
 * @param {*} type 
 * @param {*} source 
 * @returns 
 */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


/**
 * 初始化着色器程序
 * @param {*} gl 
 * @param {*} vsSource 
 * @param {*} fsSource 
 * @returns 
 * 
 * eg: 
 */
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

/**
 * 创建球体
 * @param {*} radius 
 * @param {*} divideByYAxis 
 * @param {*} divideByCircle 
 * @returns 
 */
function createSphere(radius, divideByYAxis, divideByCircle) {
  let yUnitAngle = Math.PI / divideByYAxis;
  let circleUnitAngle = (Math.PI * 2) / divideByCircle;
  let positions = [];
  let normals = [];
  for (let i = 0; i <= divideByYAxis; i++) {
    let unitY = Math.cos(yUnitAngle * i);
    let yValue = radius * unitY;

    for (let j = 0; j <= divideByCircle; j++) {
      let unitX = Math.sin(yUnitAngle * i) * Math.cos(circleUnitAngle * j);
      let unitZ = Math.sin(yUnitAngle * i) * Math.sin(circleUnitAngle * j);
      let xValue = radius * unitX;
      let zValue = radius * unitZ;
      positions.push(xValue, yValue, zValue);
      normals.push(unitX, unitY, unitZ);
    }
  }

  let indices = [];
  let circleCount = divideByCircle + 1;
  for (let j = 0; j < divideByCircle; j++) {
    for (let i = 0; i < divideByYAxis; i++) {
      indices.push(i * circleCount + j);
      indices.push(i * circleCount + j + 1);
      indices.push((i + 1) * circleCount + j);

      indices.push((i + 1) * circleCount + j);
      indices.push(i * circleCount + j + 1);
      indices.push((i + 1) * circleCount + j + 1);
    }
  }
  return {
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
    normals: new Float32Array(normals)
  };
}

/**
 * 将索引转换为无索引
 * @param {*} vertex 
 * @returns 
 */
function transformIndicesToUnIndices(vertex) {
  let indices = vertex.indices;
  let vertexsCount = indices.length;
  let destVertex = {};

  Object.keys(vertex).forEach(function(attribute) {
    if (attribute == 'indices') {
      return;
    }
    let src = vertex[attribute];
    let elementsPerVertex = getElementsCountPerVertex(attribute);
    let dest = [];
    let index = 0;
    for (let i = 0; i < indices.length; i++) {
      for (let j = 0; j < elementsPerVertex; j++) {
        dest[index] = src[indices[i] * elementsPerVertex + j];
        index++;
      }
    }
    let type = getArrayTypeByAttribName(attribute);
    destVertex[attribute] = new type(dest);
  });
  return destVertex;
}


var random = Math.random;
/**
 * 随机颜色
 * @returns 
 */
function randomColor() {
  return {
    r: random() * 255,
    g: random() * 255,
    b: random() * 255,
    a: random() * 1
  };
}

/**
 * 创建颜色
 * @param {*} vertex 
 * @returns 
 */
function createColorForVertex(vertex) {
  let vertexNums = vertex.positions;
  let colors = [];
  let color = {
    r: 255,
    g: 0,
    b: 0
  };

  for (let i = 0; i < vertexNums.length; i++) {
    if (i % 36 == 0) {
      color = randomColor();
    }
    colors.push(color.r, color.g, color.b, 255);
  }

  vertex.colors = new Uint8Array(colors);
  return vertex;
}

/**
 * 获取每个顶点的元素数量
 * @param {*} attribute 
 * @returns 
 */
function getElementsCountPerVertex(attribute) {
  let result = 3;
  switch (attribute) {
    case 'colors':
      result = 4;
      break;
    case 'indices':
      result = 1;
      break;
    case 'texcoords':
      result = 2;
      break;
  }
  return result;
}

/**
 * 获取数组类型
 * @param {*} attribute 
 * @returns 
 */
function getArrayTypeByAttribName(attribute) {
  let type = Float32Array;
  switch (attribute) {
    case 'colors':
      type = Uint8Array;
      break;
    case 'indices':
      type = Uint16Array;
      break;
  }
  return type;
}