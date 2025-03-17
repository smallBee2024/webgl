/**
 * 绘制场景的主要函数
 * @param {WebGLRenderingContext} gl - WebGL上下文
 * @param {Object} programInfo - 着色器程序信息
 * @param {Object} buffers - 顶点和颜色缓冲区
 * @param {number} squareRotation - 方块旋转角度
 */
function drawScene(gl, programInfo, buffers, squareRotation) {
  // 设置清除颜色为黑色，完全不透明
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 设置清除深度为1.0
  gl.clearDepth(1.0);
  // 启用深度测试
  gl.enable(gl.DEPTH_TEST);
  // 设置深度测试函数 - 近处的物体会遮挡远处的物体
  gl.depthFunc(gl.LEQUAL);

  // 在开始绘制之前清除画布
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 创建透视矩阵，这是一个特殊的矩阵
  // 用于模拟相机中的透视变形效果
  // 我们的视场角为45度，宽高比与画布显示尺寸匹配
  // 我们只想看到距离相机0.1到100个单位之间的物体

  // 设置视场角（45度转换为弧度）
  const fieldOfView = (45 * Math.PI) / 180;
  // 计算画布的宽高比
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // 设置近平面和远平面
  const zNear = 0.1;
  const zFar = 100.0;
  // 创建投影矩阵
  const projectionMatrix = mat4.create();

  // 注意：glmatrix.js总是将第一个参数作为
  // 接收结果的目标矩阵
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 将绘图位置设置为"单位矩阵"位置
  // 即场景的中心
  const modelViewMatrix = mat4.create();

  // 将绘图位置移动到我们想要开始绘制方块的位置
  mat4.translate(
    modelViewMatrix, // 目标矩阵
    modelViewMatrix, // 要平移的矩阵
    [-0.0, 0.0, -6.0] // 平移量
  );

  console.log('squareRotation', squareRotation);
  // 旋转方块
  mat4.rotate(
    modelViewMatrix, // 目标矩阵
    modelViewMatrix, // 要旋转的矩阵
    squareRotation, // 旋转弧度
    [0, 0, 1] // 旋转轴（Z轴）
  );

  // 告诉WebGL如何从位置缓冲区中
  // 将位置值提取到vertexPosition属性中
  setPositionAttribute(gl, buffers, programInfo);

  // 设置颜色属性
  setColorAttribute(gl, buffers, programInfo);

  // 告诉WebGL在绘制时使用我们的程序
  gl.useProgram(programInfo.program);

  // 设置着色器的统一变量（uniforms）
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  // 执行实际的绘制操作
  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

/**
 * 设置顶点位置属性
 * @param {WebGLRenderingContext} gl - WebGL上下文
 * @param {Object} buffers - 包含顶点数据的缓冲区
 * @param {Object} programInfo - 着色器程序信息
 */
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; // 每次迭代提取2个值
  const type = gl.FLOAT; // 缓冲区数据是32位浮点数
  const normalize = false; // 不进行归一化
  const stride = 0; // 每个顶点集合之间的字节数
  // 0 = 使用上面的type和numComponents
  const offset = 0; // 从缓冲区起始位置开始读取
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

/**
 * 设置顶点颜色属性
 * @param {WebGLRenderingContext} gl - WebGL上下文
 * @param {Object} buffers - 包含颜色数据的缓冲区
 * @param {Object} programInfo - 着色器程序信息
 */
function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4; // 每个颜色有4个分量（RGBA）
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };