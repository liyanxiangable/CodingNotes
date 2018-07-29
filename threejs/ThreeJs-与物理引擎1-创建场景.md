---
title: ThreeJs 与物理引擎1 创建场景
date: 2017-07-12 14:51:15
tags:
---

代码1：
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	    <title>three.js 基本场景</title>
	
	    <style>
	        body {
	            margin: 0;
	        }
	    </style>
	
	    <script src="js/three.js"></script>
	    <script src="js/ammo.js"></script>
	    <script src="js/OrbitControls.js"></script>
	    <script src="js/stats.js"></script>
	</head>
	<body>
	
	<div id="container"><br /><br /><br /><br /><br />Loading...</div>
	
	</body>
	
	<script>
	
	    /// 全局变量
	
	    /// 绘图相关变量
	
	    // 声明webgl容器，声明状态显示器
	    var container, stats;
	    // 声明相机、控制器、场景、渲染器
	    var camera, controls, scene, renderer;
	    // 声明文字的载入模块
	    var textureLoader;
	    // 声明threejs时钟
	    var clock = new THREE.Clock();
	
	    /// - 主程序
	
	    // 通过init来初始化并启动程序
	    init();
	    // 通过animate来进行动画渲染
	    animate();
	
	    /// -函数定义
	
	    // 初始化函数，其中只有执行一个函数initGraphics
	    function init() {
	        initGraphics();
	    }
	    // 初始化图形函数
	    function initGraphics() {
	        // 首先获取webgl容器，并将容器内容清空。
	        container = document.getElementById('container');
	        container.innerHTML = "";
	        // 创建一个远景透视相机，并将相机位置放置为（-7， 5， 8）的位置
	        camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
	        camera.position.x = -7;
	        camera.position.y = 5;
	        camera.position.z = 8;
	        // 创建一个相机控制器，将控制器的中心Y坐标设为2
	        controls = new THREE.OrbitControls(camera);
	        controls.center.y = 2;
	        // 创建一个渲染器，将渲染器清空颜色设为0xbfd1e5，设置像素比为浏览器的像素比，设置渲染区域，设置启动阴影贴图
	        renderer = new THREE.WebGLRenderer();
	        renderer.setClearColor( 0xbfd1e5 );
	        renderer.setPixelRatio(window.devicePixelRatio);
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        renderer.shadowMap.enabled = true;
	        // 创建一个文字载入实例
	        textureLoader = new THREE.TextureLoader();
	        // 创建场景
	        scene = new THREE.Scene();
	        // 创建环境光并添加到场景，颜色为0x404040
	        var ambientLight = new THREE.AmbientLight(0x404040);
	        scene.add(ambientLight);
	        // 创建方向光（平行光）并加入场景，颜色为0xffffff，光强为1。光源位置设为（-10， 10， 5），投射阴影
	        var light = new THREE.DirectionalLight(0xffffff, 1);
	        light.position.set(-10, 10, 5);
	        light.castShadow = true;
	        var d = 10;
	        // 方向光的shadow属性属于DirectionalLightShadow类，用来计算方向光的属性。
	        // 不同于其他的利用透视相机的投影，这个是利用正交相机的投影。
	        // 他的camere属性是一个正交相机OrthographicCamera。并规定了相机视锥的各个面
	        light.shadow.camera.left = -d;
	        light.shadow.camera.right = d;
	        light.shadow.camera.top = d;
	        light.shadow.camera.bottom = -d;
	        light.shadow.camera.near = 2;
	        light.shadow.camera.far = 2;
	        light.shadow.mapSize.x = 1024;
	        light.shadow.mapSize.y = 1024;
	        scene.add(light);
	        // 将容器内添加渲染的场景
	        container.appendChild(renderer.domElement);
	
	        // 设置状态，绝对定位，添加到容器中
	        stats = new Stats();
	        stats.domElement.style.position = 'absolute';
	        stats.domElement.style.top = 'absolute';
	        container.appendChild(stats.domElement);
	
	        // 添加窗口大小变化监听
	        window.addEventListener('resize', onWindowResize, false);
	    }
	
	    // 当窗口大小有变化的时候，
	    function onWindowResize() {
	        // 设置视锥宽高比为窗口的宽高比
	        camera.aspect = window.innerWidth / window.innerHeight;
	        // 更新相机投影矩阵，此函数必须在参数发生变化后调用
	        camera.updateProjectionMatrix();
	        // 重新设置渲染的尺寸
	        renderer.setSize( window.innerWidth, window.innerHeight );
	    }
	
	    // 动画函数，以动画标准的帧数来调用render函数，并显示状态
	    function animate() {
	        requestAnimationFrame(animate);
	        render();
	        stats.update();
	    }
	
	    // 渲染函数
	    function render() {
	        // 获取时钟增量，也就是该函数本次调用和上次调用之间的时间间隔
	        var deltaTime = clock.getDelta();
	        // 控制器进行刷新，调用update函数。
	        // 控制器模块没有文档，代码注释也很少。目前只需知道调用update更新
	        controls.update(deltaTime);
	        // 渲染器进行渲染
	        renderer.render(scene, camera);
	    }
	</script>
	
	</html>

简单讲解写到了代码注释之中，以下是其他部分解释：
clock 是 threejs 的核心模块之一。可以创建跟踪时间对象。
在 Three.js 中，是通过 OrbitControls.js API 来支持鼠标交互的。因为不是所有 3D 应用程序都要求用来与其他一些硬件设备进行交互的用户交互、OrbitControls 和其他 API 是可选的库（参阅 可选的 Three.js 控制 API 边栏）。OrbitControls 的工作原理是在 3D 场景内与鼠标输入一致地移动摄像机的位置。





参考链接：
1. [https://threejs.org/docs/index.html#api/core/Clock](https://threejs.org/docs/index.html#api/core/Clock "clock")
2. [https://www.ibm.com/developerworks/cn/web/wa-webgl3/](https://www.ibm.com/developerworks/cn/web/wa-webgl3/ "orbit-control")