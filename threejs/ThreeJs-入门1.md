---
title: ThreeJs 入门1
date: 2017-07-06 20:05:46
tags:
---

# 渲染并显示三维对象 #

	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Title</title>
	    <script src="js/jquery.js"></script>
	    <script src="js/three.js"></script>
	</head>
	<body>
	<div id="WebGL-output"></div>
	<script typeof="text/javascript">
	    $(function () {
	        // 定义一个场景
	        var scene = new THREE.Scene();
	
	        // 定义一个相机
	        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	        // 定义一个渲染器
	        var renderer = new THREE.WebGLRenderer();
	        renderer.setClearColor(0xEEEEEE);
	        renderer.setSize(window.innerWidth, window.innerHeight);
	
	        // 定义一个坐标系，大小为20。添加到场景
	        var axes = new THREE.AxisHelper(20);
	        scene.add(axes);
	
	        // 定义一个平面，x轴长度60，y轴长度20。材质
	        var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
	        var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
	        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	
	        plane.rotation.x = -0.5 * Math.PI;
	
	        plane.position.x = 15;
	        plane.position.y = 0;
	        plane.position.z = 0;
	
	        scene.add(plane);
	
	        var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
	        var cubeMaterial = new THREE.MeshBasicMaterial({
	            color: 0xff0000,
	            wireframe: true
	        });
	        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	
	        cube.position.x = -4;
	        cube.position.y = 3;
	        cube.position.z = 0;
	
	        scene.add(cube);
	
	        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
	        var sphereMaterial = new THREE.MeshBasicMaterial({
	            color: 0x77ffff,
	            wireframe: true
	        });
	        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	
	        cube.position.x = 20;
	        cube.position.y = 4;
	        cube.position.z = 2;
	
	        scene.add(sphere);
	
	        camera.position.x = -30;
	        camera.position.y = 40;
	        camera.position.z = 30;
	        camera.lookAt(scene.position);
	
	        /*
	        选择webgl显示的父元素（append为内部插入）
	        查看源码，本程序中渲染器renderer有属性domElement
	        此属性为是一个_canvas，这个属性与渲染器构造函数有关
	        可以在浏览器开发者工具中查看添加的canvas元素。
	        */
	        $("#WebGL-output").append(renderer.domElement);
	        renderer.render(scene, camera);
	    });
	</script>
	</body>
	</html>

# 添加材质、灯光和阴影 #
首先在场景中添加光源：
    // 添加光源，设定光源位置，添加入场景
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);
现在渲染场景的画并不会有效果，因为不同材质对光源的反应并不相同，而且调用 MeshBasicMaterial() 得到的基础材质并不会对光源有反应，而只会以指定的颜色显示物体。所以还需要对几何体改变材质。
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x77ffff});
现在已经有了效果。在threejs中，有两种材料可以对光源产生效果，分别是 MeshLambertMaterial 与 MeshPhongMarterial。
下面添加阴影，修改添加代码：
    // 设置渲染器的清除颜色与大小
    renderer.setClearColor(0xeeeeee, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置开启阴影
    renderer.shadowMapEnabled = true;
开启了阴影之后，还不能有效果。现在还应该指定哪个物体投射阴影，哪个物体接受阴影。
    // 添加阴影的投射与接受
    plane.receiveShadow = true;
    cube.castShadow = true;
    sphere.castShadow = true;
最后一步是规定哪一个光源可以产生阴影：
    // 设定产生阴影的光源
    spotLight.castShadow = true;
现在就有了阴影效果了。

# 使用动画扩展场景 #

通过 requestAnimationFrame() 方法，可以指定一个函数按照一定时间间隔调用，如下：
    function renderScene() {
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
在 renderScene 函数中，调用 requestAnimationFrame 的目的是让这个动画持续运行。

最终代码如下：
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Title</title>
	    <script src="js/jquery.js"></script>
	    <script src="js/three.js"></script>
	    <script src="js/stats.js"></script>
	</head>
	<body>
	<div id="Stats-output"></div>
	<div id="WebGL-output"></div>
	<script typeof="text/javascript">
	
	    $(function () {
	        // 定义一个场景
	        var scene = new THREE.Scene();
	
	        // 定义一个相机
	        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	        // 定义一个渲染器
	        var renderer = new THREE.WebGLRenderer();
	        renderer.setClearColor(0xEEEEEE);
	        renderer.setSize(window.innerWidth, window.innerHeight);
	
	        // 定义一个坐标系，大小为20。添加到场景
	        var axes = new THREE.AxisHelper(20);
	        scene.add(axes);
	
	        // 定义一个平面，x轴长度60，y轴长度20。材质
	        var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
	        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	
	        plane.rotation.x = -0.5 * Math.PI;
	
	        plane.position.x = 15;
	        plane.position.y = 0;
	        plane.position.z = 0;
	
	        scene.add(plane);
	
	        var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
	        var cubeMaterial = new THREE.MeshLambertMaterial({
	            color: 0xff0000,
	        //    wireframe: true
	        });
	        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	
	        cube.position.x = -4;
	        cube.position.y = 3;
	        cube.position.z = 0;
	
	        scene.add(cube);
	
	        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
	        var sphereMaterial = new THREE.MeshLambertMaterial({
	            color: 0x77ffff,
	          //  wireframe: true
	        });
	        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	
	        cube.position.x = 20;
	        cube.position.y = 4;
	        cube.position.z = 2;
	
	        scene.add(sphere);
	
	        camera.position.x = -30;
	        camera.position.y = 40;
	        camera.position.z = 30;
	
	        // 相机指向场景中心位置
	        camera.lookAt(scene.position);
	
	        // 添加光源，设定光源位置，添加入场景
	        var spotLight = new THREE.SpotLight(0xffffff);
	        spotLight.position.set(-40, 60, -10);
	        scene.add(spotLight);
	
	        // 设置渲染器的清除颜色与大小
	        renderer.setClearColor(0xeeeeee, 1.0);
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        // 设置阴影
	        renderer.shadowMapEnabled = true;
	
	        // 添加阴影的投射与接受
	        plane.receiveShadow = true;
	        cube.castShadow = true;
	        sphere.castShadow = true;
	
	        // 设定产生阴影的光源
	        spotLight.castShadow = true;
	
	        /*
	        选择webgl显示的父元素（append为内部插入）
	        查看源码，本程序中渲染器renderer有属性domElement
	        此属性为是一个_canvas，这个属性与渲染器构造函数有关
	        总之为一个canvas元素
	        */
	        $("#WebGL-output").append(renderer.domElement);
	
	        // initStats函数是用来在左上角创建一个状态显示区域
	        function initStats() {
	            var stats = new Stats();
	            stats.setMode(0);
	            stats.domElement.style.position = 'absolute';
	            stats.domElement.style.left = '0px';
	            stats.domElement.style.top = '0px';
	            $("#Stats-output").append(stats.domElement);
	            return stats;
	        }
	
			// 渲染状态显示器
	        function render() {
	            stats.update();
	            requestAnimationFrame(renderScene);
	            renderer.render(scene, camera);
	        }
	
			// 渲染webgl动画
	        var step = 0;
	        function render() {
	            // 让立方体围绕三个轴进行转动
	            cube.rotation.x += 0.02;
	            cube.rotation.y += 0.02;
	            cube.rotation.z += 0.02;
	
	            // 球体的运动轨迹，x与y合并起来是一个半圆
	            step += 0.04;
	            sphere.position.x = 20 + (10 * Math.cos(step));
				// 绝对值函数保证轨迹永远在正半轴
	            sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
	
	            requestAnimationFrame(render);
	            renderer.render(scene, camera);
	        }
	
	        var stats = initStats();
	        renderScene();
	        render();
	    });
	</script>
	</body>
	</html>
这样，带有动画的 WebGL 就显示成功了。


