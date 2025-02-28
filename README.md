# webgl
3D学习



英文单词：

- shader：着色器；着色程序；
- vertex：顶点
- fragment：碎片；片段；残存部分



## 学习资料：

[webGL入门与实践](https://github.com/lucefer/webgl)

《webGL编程指南》已购

[MDN官网]()



## 关键词：

OpenGL Shader

 [OpenGL ES 着色语言](https://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf)(**GLSL**) 

[glMatrix library](https://glmatrix.net/).



## GLSL

* gl_Position：顶点的`裁剪坐标系坐标`，包含 X, Y, Z，W 四个坐标分量，顶点着色器接收到这个坐标之后，对它进行透视除法，即将各个分量同时除以 W，转换成 `NDC 坐标`，NDC 坐标每个分量的取值范围都在【-1, 1】之间，GPU 获取这个属性值作为顶点的最终位置进行绘制。

* gl_FragColor：片元（像素）颜色，包含 R, G, B, A 四个颜色分量，且每个分量的取值范围在【0,1】之间，GPU 获取这个值作为像素的最终颜色进行着色。

* gl\_PointSize：绘制到屏幕的点的大小，需要注意的是，gl\_PointSize只有在绘制图元是`点`的时候才会生效。当我们绘制线段或者三角形的时候，gl_PointSize是不起作用的。

* vec4：包含四个浮点元素的`容器类型`，vec 是 vector（向量）的单词简写，vec4 代表包含 4 个浮点数的向量。此外，还有 `vec2`、`vec3` 等类型，代表包含`2个`或者`3个`浮点数的容器。

* GLSL 中 gl\_Position 所接收的坐标所在坐标系是裁剪坐标系 ，不同于我们的浏览器窗口坐标系。所以当我们赋予 gl\_Position 位置信息的时候，需要对其进行转换才能正确显示。

* gl_FragColor，属于 GLSL 内置属性，用来设置片元颜色，包含 4 个分量 (R, G, B, A)，各个颜色分量的取值范围是【0，1】，也不同于我们常规颜色的【0，255】取值范围，所以当我们给 gl\_FragColor 赋值时，也需要对其进行转换。平常我们所采用的颜色值（R, G, B, A），对应的转换公式为： (R值/255，G值/255，B值/255，A值/1）。拿红色举例，在CSS中，红色用 `RGBA` 形式表示是（255，0，0，1），那么转换成 GLSL 形式就是(255 / 255, 0 / 255, 0 / 255, 1 / 1)，转换后的值为（1.0, 0.0, 0.0, 1.0)。

