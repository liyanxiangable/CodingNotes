---
title: ThreeJs 学习笔记1  getting started
date: 2017-07-05 10:35:50
tags:
---

开始学Threejs了，跟着官方文档边看边做吧。

# 创建一个场景 #
> The goal of this section is to give a brief introduction to three.js. We will start by setting up a scene, with a spinning cube. A working example is provided at the bottom of the page in case you get stuck and need help.

本单元的主要目标是对threejs进行简短的介绍。我们将会以建立一个带有旋转立方体的场景为开始。

## 开始之前 ##
> Before you can use three.js, you need somewhere to display it. Save the following HTML to a file on your computer, along with a copy of three.js in the js/ directory, and open it in your browser.

在使用threejs之前，你需要在某处来部署他。在你的电脑上存储先下面的HTML文件，并且将threejs放到相对应的js/directoy目录中，最后在浏览器总打开HTML文件。
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset=utf-8>
			<title>My first three.js app</title>
			<style>
				body { margin: 0; }
				canvas { width: 100%; height: 100% }
			</style>
		</head>
		<body>
			<script src="js/three.js"></script>
			<script>
				// Our Javascript will go here.
			</script>
		</body>
	</html>
That's all. All the code below goes into the empty <scripttag.

好了，之后所有的代码将会在空的script标签中运行。

## 创建场景 ##
> To actually be able to display anything with three.js, we need three things: A scene, a camera, and a renderer so we can render the scene with the camera.

为了真正可以使用threejs来展示某个物体，我们需要三个东西，包括一个场景，一个“相机”，和一个渲染器。这样我们就能够使用相机来在场景之中进行渲染。
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
> Let's take a moment to explain what's going on here. We have now set up the scene, our camera and the renderer. There are a few different cameras in three.js. For now, let's use a PerspectiveCamera. The first attribute is the field of view.

让我们花点时间来解释下这里发生了什么。我们已经创建了场景、相机与渲染器。在threejs中有不同的相机，对于目前情况，我们使用PerspectiveCamera这个相机，第一个参数是“视场”、“视界”。
> The second one is the aspect ratio. You almost always want to use the width of the element divided by the height, or you'll get the same result as when you play old movies on a widescreen TV - the image looks squished.

第二个参数是宽高比、纵横比。你一般情况下使用待展示元素的宽度除以元素的高度。或者你就会获得当你在宽屏电视上播放旧电影的时候的结果，图像看起来被压扁了。
> The next two attributes are the near and far clipping plane. What that means, is that objects further away from the camera than the value of far or closer than near won't be rendered. You don't have to worry about this now, but you may want to use other values in your apps to get better performance.

接下来的两个参数是近剪切面与远剪切面。这两个东西是两个平面，在平面近剪切面前方与远剪切面后方的物体不会被渲染。你现阶段不用担心这个，但是你可能想要在你的应用程序之中使用别的值来得到更好的显示效果。
> Next up is the renderer. This is where the magic happens. In addition to the WebGLRenderer we use here, three.js comes with a few others, often used as fallbacks for users with older browsers or for those who don't have WebGL support for some reason.

下一步是渲染器，这里就是见证奇迹的时刻。除了我们在此使用的 WebGLRenderer，threejs 还有一些其他的渲染器，这些渲染器经常用来作为那些使用旧式浏览器的用户或者是那些出于某些原因不支持 WebGL 的回调函数。
> In addition to creating the renderer instance, we also need to set the size at which we want it to render our app. It's a good idea to use the width and height of the area we want to fill with our app - in this case, the width and height of the browser window. For performance intensive apps, you can also give setSize smaller values, like window.innerWidth/2 and window.innerHeight/2, which will make the app render at half size.

除了创建渲染器实例，我们还需要设定我们想要渲染的大小。使用在应用程序中我们想要占满的宽度与高度作为这个大小参数是很好的选择，在这里是浏览器的宽度与高度。为了加强应用程序的效果，你还可以将 setSize 的值设定的较小一些。比如说 window.innerWidth/2 与 window.innerHeight/2，这将使应用程序按照一半大小进行渲染。
> If you wish to keep the size of your app but render it at a lower resolution, you can do so by calling setSize with false as updateStyle (the third argument). For example, setSize(window.innerWidth/2, window.innerHeight/2, false) will render your app at half resolution, given that your <canvashas 100% width and height.

如果你想要在你的应用程序之中保持原有大小的渲染但是却使用较低分辨率，你可以调用setSize函数来讲第三个参数也就是 updateStyle 赋值为false。例如，假定你的 canvas 具有100%的宽度与高度，setSize(window.innerWidth/2, window.innerHeight/2, false) 将会使应用程序以一半的分辨率来进行渲染。
> Last but not least, we add the renderer element to our HTML document. This is a canvas element the renderer uses to display the scene to us.

最后，我们在HTML文档中添加渲染器元素，渲染器通常在一个canvase元素对我们进行场景的展示。
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	
	camera.position.z = 5;

> To create a cube, we need a BoxGeometry. This is an object that contains all the points (vertices) and fill (faces) of the cube. We'll explore this more in the future.

为了创建一个立方体，我们需要一个BoxGeometry。这个类包含所有立方体中所有的点（顶点）与面。详细内容我们之后介绍。
> In addition to the geometry, we need a material to color it. Three.js comes with several materials, but we'll stick to the MeshBasicMaterial for now. All materials take an object of properties which will be applied to them. To keep things very simple, we only supply a color attribute of 0x00ff00, which is green. This works the same way that colors work in CSS or Photoshop (hex colors).

除了几何体，我们还需要材质来对其进行涂色。threejs带有几种材料，但是我们目前就一直使用 MeshBasicMaterial 这种材料。所有的材质均是对象的一个属性，可以添加到对象上。为了简化过程，我们仅仅使用色号为 0x00ff00 的颜色（就是绿色）来进行上色。这和 CSS 与 PS 中的颜色是一样的。

> The third thing we need is a Mesh. A mesh is an object that takes a geometry, and applies a material to it, which we then can insert to our scene, and move freely around.
By default, when we call scene.add(), the thing we add will be added to the coordinates (0,0,0). This would cause both the camera and the cube to be inside each other. To avoid this, we simply move the camera out a bit.

我们需要的第三个东西是 Mesh，Mesh 是选取一个几何体，并且对其设定材质，之后我们可以将其插入场景并可以自由移动的对象。默认情况下，当我们使用 scene.add() 的时候，我们添加的东西将会被添加到（0,0,0）的坐标位置。这将导致相机与立方体重合。为了避免这种情况，我们将相机略微移动。

## 渲染场景 ##
> If you copied the code from above into the HTML file we created earlier, you wouldn't be able to see anything. This is because we're not actually rendering anything yet. For that, we need what's called a render or animate loop.

如果你将我们之前的代码复制进了 HTML 文件，你会看不到任何东西。这是因为我们还并没有真正的渲染什么东西。为此，我们需要所谓的渲染或者说是动画循环。

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
	animate();

> This will create a loop that causes the renderer to draw the scene 60 times per second. If you're new to writing games in the browser, you might say "why don't we just create a setInterval? The thing is - we could, but requestAnimationFrame has a number of advantages. Perhaps the most important one is that it pauses when the user navigates to another browser tab, hence not wasting their precious processing power and battery life.

这将创建一个循环来使渲染器以每秒钟60次的速度进行渲染。如果你是浏览器端游戏发开新手的话，你可能会有疑问“为什么不用 setInterval 函数呢？”。答案是——可以，但是使用 requestAnimationFrame 具有很多的优势。最为重要的一点可能就是当用户切换到另一个浏览器当中的时候，requestAnimationFrame 会暂停。因此这就不会导致宝贵的处理能力资源的与电量的浪费。

## 将立方体制作成动画 ##

> If you insert all the code above into the file you created before we began, you should see a green box. Let's make it all a little more interesting by rotating it.

如果你将所有以上的代码添加带你开始的时候所创建的文件中，你应当会看到一个绿色的盒子。让我们来将他旋转来使他变得有趣一点。

> Add the following right above the renderer.render call in your animate function:

在你的animate函数中在 renderer.render 之前添加以下的代码：

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

> This will be run every frame (60 times per second), and give the cube a nice rotation animation. Basically, anything you want to move or change while the app is running has to go through the animate loop. You can of course call other functions from there, so that you don't end up with a animate function that's hundreds of lines.

这些代码将在每一个框架中运行，并且给立方体添加了一个很好的旋转的动画。基本上，当应用程序运行的时候，你想要移动或者改变的任何物体都处于动画循环之中。当然，在此你可以调用其他的函数，这样的话你你就不用以数百行的代码量结束animate函数。

## 结果 ##

> Congratulations! You have now completed your first three.js application. It's simple, you have to start somewhere.

恭喜！你已经完成了一个threejs的第一个应用。它很简单，你需要在某些地方启动它。

> The full code is available below. Play around with it to get a better understanding of how it works.

全部的代码如下。和他一起玩吧，并更好的理解他是怎样工作的。

	<html>
		<head>
			<title>My first three.js app</title>
			<style>
				body { margin: 0; }
				canvas { width: 100%; height: 100% }
			</style>
		</head>
		<body>
			<script src="js/three.js"></script>
			<script>
				var scene = new THREE.Scene();
				var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	
				var renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
	
				var geometry = new THREE.BoxGeometry( 1, 1, 1 );
				var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
				var cube = new THREE.Mesh( geometry, material );
				scene.add( cube );
	
				camera.position.z = 5;
	
				var animate = function () {
					requestAnimationFrame( animate );
	
					cube.rotation.x += 0.1;
					cube.rotation.y += 0.1;
	
					renderer.render(scene, camera);
				};
	
				animate();
			</script>
		</body>
	</html>

# 线条制图 #

> Let's say you want to draw a line or a circle, not a wireframe Mesh. First we need to setup the renderer, scene and camera (see the Creating a scene page).

如果你想要画一条线或者是一个圆圈而不是一个线框图Mesh。我们要做的第一步就是创建渲染器、场景与相机。

> Here is the code that we will use:

下面是我们将要使用的代码：

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 0, 100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	var scene = new THREE.Scene();

> Next thing we will do is define a material. For lines we have to use LineBasicMaterial or LineDashedMaterial.

下一步我们要做的就是定义一个材质。对于线条，我们必须使用 LineBasicMaterial 或者 LineDashedMaterial。

	//create a blue LineBasicMaterial
	var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

> After material we will need a Geometry or BufferGeometry with some vertices (it's recommended to use a BufferGeometry as it's more performant, however for simplicity we'll use a Geometry here):

在材质设定之后，我们需要一个带有一些顶点的 Geometry 或者 BufferGeometry。（比较推荐使用BufferGeometry，因为他比较高性能，然而若追求简化，我们最好使用 Geometry）
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
	geometry.vertices.push(new THREE.Vector3(0, 10, 0));
	geometry.vertices.push(new THREE.Vector3(10, 0, 0));

> Note that lines are drawn between each consecutive pair of vertices, but not between the first and last (the line is not closed.)

要注意线条是在连续的顶点之间相连的图形，而不是第一个顶点与最后一个顶点之间的连线。

> Now that we have points for two lines and a material, we can put them together to form a line.

我们现在有了构成两条线的一些点与材质，我们可以将他们放到一起来形成一条线。

	var line = new THREE.Line(geometry, material);

> All that's left is to add it to the scene and call render.

将他们添加进场景并且进行渲染。

	scene.add(line);
	renderer.render(scene, camera);

> You should now be seeing an arrow pointing upwards, made from two blue lines.

你现在应当能够看到一个由两条线构成的向上的箭头。

新词汇：
1. scene：场景
2. spinning/spin：旋转
3. field of view：视场、视界
4. aspect ratio：宽高比、纵横比
5. squished：压扁的
6. clipping plane：剪切面
7. resolution：分辨率
8. coordinate：坐标
9. compatibility：互换性，通用性
10. wireframe：线框图

参考链接：

1. [https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene](https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene "本节官方文档")
2. [https://threejs.org/build/three.js](https://threejs.org/build/three.js "threejs源文件")
3. [https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js](https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js "测试WebGL代码链接")
4. [https://get.webgl.org/](https://get.webgl.org/ "检查WebGL是否支持简单方法")
5. 