---
title: WebGL 入门1
date: 2017-07-05 18:55:44
tags:
---

HTML5 引入了 canvas 标签，他支持 javascript 动态地绘制图形。默认情况下，canvas 是透明的。为了在 canvas 上绘制二维图形，需要以下三个步骤：
1. 获取 canvas 元素
2. 向该元素请求二维图形的“绘图上下文”
3. 在绘图上下文上调用相应的绘图函数，以绘制二维图形
绘制三维图形也是一样的，也是对应于二维图形的三个步骤。
canvas 元素可以灵活的同时支持二维与三维图形，它不直接提供绘图方法，而是提供一种叫做上下文的基址来进行绘图。所以要首先获得上下文。canvas.getContext() 方法的参数指定了上下文的类型。本例中绘制二维图形就指定为'2d'，注意区分大小写。canvas中的坐标，横轴为x轴正方向向右，纵轴为y轴正方向向下。
WebGL依赖于一种成为着色器的绘图机制。在WebGL中，着色器以字符串的形式潜入在js中，WebGL有两种着色器，分别是：
1. 顶点着色器。顶点着色器是用来描述定点特性的程序。顶点是二维或者三维空间中的一个点，比如端点或者交点等。
2. 片元着色器。进行逐片元处理，例如光照。片元是一个WebGL术语，可以将其理解为像素（图像的单元）。
javascript读取了着色器的相关信息，然后储存在WebGL系统中进行调用。着色器使用类似于C语言的OPENGL ES 着色器语言来编写，着色器语言的字符串中，换行符不是必须的。但是换行符可以在着色器内部出错时，获取到错误代码的行号，有助于调试检查代码。
WebGL程序包含运行在浏览器中的js和运行在WebGL系统的着色器程序这两个部分，大部分的WebGL程序都遵循以下流程：
1. 获取canvas元素
2. 获取WebGL绘图上下文
3. 初始化着色器
4. 设置canvas背景颜色
5. 清除canvas
6. 绘图

着色器语言中，gl_Position 表示顶点的位置，类型是vec4（vec是一个由四个float类型的值组成的矢量），必须进行赋值；gl_PointSize 表示顶点的尺寸，类型为float，默认值为1。当我们只有三个float类型值的时候，可以使用着色器内置的 vec() 方法进行转化，将第四个分量赋值为1.0成为 vec4 类型的变量。有四个分量组成的矢量被称为其次坐标。其次坐标 (x, y, z, w) 等价于三维坐标 (x/w, y/w, z/w)，所以如果其次坐标的第4个分量是1，就可以将他当作三维坐标来使用。
顶点着色器控制着点的位置和大小，片元着色器控制着点的颜色。片元着色器将点的颜色赋给 gl_FragColor 变量。此变量是片元着色器唯一的内置变量。他控制着像素在屏幕上最终显示颜色。颜色值也是 vec4 类型，包括四个float类型的值（值的区间为0到1），分别表示RGBA。
建立好着色器之后，清空canvas，然后进行绘制。使用的函数是 drawArrays()，他有三个参数：
1. mode：指定绘图的方式，可以接收以下常量符号	gl.POINTS/gl.LINES/gl.LINE_STRIP/gl.LINE_LOOP/gl.TRIANGLES/gl.TRIANGLE_STRIP/gl.TRIANGLE_FAN。
2. first：指定从哪一个点开始绘制，整型，顺序从0开始
3. count：指定绘图所需要的顶点数量，整型
此函数返回值为空。当我们执行 drawArrays() 函数时，顶点着色器将被执行 count 次，当顶点着色器执行完成之后，片元着色器就会开始执行。
WebGL 处理的是三维图形，所以他使用的是三维坐标系统，具有X轴、Y轴、Z轴。当面向计算机屏幕的时候，X轴是水平的，正方向向右；Y轴是竖直的，正方向向下；Z轴垂直于屏幕，正方向向外。观察者的眼睛位于原点(0.0,, 0.0, 0.0)处，视线则是沿着Z轴的负方向，从眼睛指向屏幕。这套坐标系又称为右手坐标系。

若要通过js程序中将位置信息传递给顶点着色器，有两种方法可以实现，分别是 attribute 变量与 uniform 变量。attribute 用来传输那些与顶点相关的数据，uniform 则传输那些与顶点无关的数据。attribute 是一种 GLSL ES 变量，用来从外部想顶点着色器内传输数据，只有顶点着色器能够使用它。使用 attribute 变量分单个步骤：
1. 在顶点着色器中，声明 attribute 变量。
2. 将 attribute 变量复制给 gl_Position 变量。
3. 向 attribute 变量中传递数据。
如以下程序：

	// 定点着色器程序
	var VSHADER_SOURCE =
	    'attribute vec4 a_Position;\n' +                     // 声明attribute变量
	    'void main() {\n' +
	    'gl_Position = a_Position;\n' +                     // 设置坐标
	    'gl_PointSize = 10.0;\n' +                          // 设置尺寸
	    '}\n';
	
	// 片元着色器程序
	var FSHADER_SOURCE =
	    'void main() {\n' +
	    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +      // 设置颜色
	    '}\n';
	
	function main() {
	    // 获取canvas元素
	    var canvas = document.getElementById('webgl');
	
	    // 获取webgl绘图上下文
	    var gl = getWebGLContext(canvas);
	    if (!gl) {
	        console.log("Failed");
	        return;
	    }
	
	    // 初始化着色起
	    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	        console.log('Failed');
	        return;
	    }
	
	    // 获取attribute变量的储存位置
	    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	
	    // 将顶点位置输出给attribute变量
	    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	
	    // 设置canvas的背景色
	    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	    // 清空canvas
	    gl.clear(gl.COLOR_BUFFER_BIT);
	
	    // 绘制一个点
	    gl.drawArrays(gl.POINTS, 0, 1);
	}

其中，attribute vec4 a_Position;中的attribute为存储限定符，他表示接下来的变量是一个attribute变量。attribute变量必须是全局变量。