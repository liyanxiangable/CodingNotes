---
title: PhysiJS 代码研读 1
date: 2017-07-13 09:01:33
tags:
---

threejs 现在已经大体了解了一下，如果想要实现虚拟装配的话。还需要很多的物理方向的实现，比如说碰撞检测、几何约束、各种动力学等。因此有必要研究一下 physijs 库，这是一个支持 threejs 的库，包括各种的物理学功能，能够在场景之中添加物理学效果。比如 learning threejs 书中多米诺骨牌的例子。
如果在render的线程中进行物理模拟，会非常耗费CPU资源，场景的帧频胡受到严重的影响。为此，physijs 选择在后台线程中执行计算。这里的后台线程是由web workers规范定义的，现在大多数浏览器都实现了这个功能。根据这个规范，你可以在一个单独的线程中进行CPU密集的任务，这样就不会影响渲染了。
对于 Physijs 来说，这也就意味着我们必须要配置一个带有执行任务的javascript文件，并且告诉physijs在哪里可以找到用来模拟场景的ammojs文件。之所以要包含ammojs文件，原因是physijs只是ammojs的一个包装器，使得他更易使用。ammojs是一个实现物理引擎的库，physijs只是在这个物理库的基础上提供了便于使用的接口。由于physijs只是一个包装器，因此我们也可以使用其他的物理引擎，比如说cannonjs。
我们的做法是设置下面的两个属性：
    Physijs.scripts.worker = '../libs/physijs_worker.js';
    Physijs.scripts.ammo = '../libs/ammo.js';
这两个属性分别想想我们想要执行的任务线程与指向内部使用的ammojs库。接下来我们需要创建一个场景。physijs在threejs的普通场景外有提供了一个包装器，所以在代码之中可以像这样创建场景：
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -50, 0));
这样就创建出了一个应用了物理效果的场景，而且我们还设置了重力。在本例中，我们将重力设置在y轴方向，重力系数为-10。也就是说，场景中的对象可以竖直下落。你可以在运行时，在各个坐标轴方向上将重力设置或修改成你认为合适的值，然后场景就会做出相应的反应。
在开始模拟物理效果之前，我们需要在场景中添加一些对象。为此，我们可以同threejs种的普遍方法来定义对象，但必须用一个特定的physijs对象将这些对象包裹起来：
    var stoneGeom = new THREE.BoxGeometry(0.6, 6, 2);
    var stone = new Physijs.BoxMesh(stoneGeom, Physijs.createMaterial(new THREE.MeshPhongMaterial(
            {
                color: scale(Math.random()).hex(),
                transparent: true, opacity: 0.8,
				// map: THREE.ImageUtils.loadTexture( '../assets/textures/general/darker_wood.jpg' )
            })));
在例子中我们创建了一个简单的立方体，然后我们创建了一个 Physijs.BoxMesh对象，而不是THREE.Mesh对象，BoxMesh可以告诉physijs在模拟和检测碰撞的时候，将这个网格当作一个盒子。physijs提供了许多的网格，你可以将他们用在各种图形上。
现在BoxMesh对象已经添加到了场景中。我们第一个Physijs场景中的各个部分都准备好了。下面要做的就是告诉physijs模拟物理效果，并更新场景中个对象的位置个角度。为此我们可以钓鱼那个刚刚创建的场景中的 simulate 方法。所以修改基础render循环代码：
    render = function () {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        scene.simulate(undefined, 1);
    };
随着最后一步的完成，用于physijs场景的基础配置也就完成了。
以下是整个多米诺骨牌的代码：
	<!DOCTYPE html>
	
	<html>
	<style>
	    body {
	        /* set margin to 0 and overflow to hidden, to go fullscreen */
	        margin: 0;
	        overflow: hidden;
	    }
	</style>
	
	<head>
	    <title>Rigid body - Physijs</title>
	
	
	    <script type="text/javascript" src="js/three.js"></script>
	    <script type="text/javascript" src="js/stats.js"></script>
	    <script type="text/javascript" src="js/physi.js"></script>
	    <script type="text/javascript" src="js/chroma.js"></script>
	    <script type="text/javascript" src="js/dat.gui.js"></script>
	
	
	    <script type="text/javascript">
	
	        'use strict';
	
	        // 允许禁用内部缓存
	        var scale = chroma.scale(['green', 'white']);
	
	        // 定义执行任务线程的属性
	        Physijs.scripts.worker = '../libs/physijs_worker.js';
	        // 定义物理环境库
	        Physijs.scripts.ammo = '../libs/ammo.js';
	
	        var initScene, render, applyForce, setMousePosition, mouse_position,
	            ground_material, box_material,
	            renderer, render_stats, scene, ground, light, camera, box, boxes = [];
	
	        // initScene是一个初始化函数
	        initScene = function () {
	
	            // 创建渲染器，设置图形保真，设定渲染窗口大小，清除颜色。将渲染器添加入DOM
	            renderer = new THREE.WebGLRenderer({antialias: true});
	            renderer.setSize(window.innerWidth, window.innerHeight);
	            renderer.setClearColor(new THREE.Color(0x000000));
	            document.getElementById('viewport').appendChild(renderer.domElement);
	
	            // 创建状态显示器，绝对定位。添加窗台显示器入DOM
	            render_stats = new Stats();
	            render_stats.domElement.style.position = 'absolute';
	            render_stats.domElement.style.top = '1px';
	            render_stats.domElement.style.zIndex = 100;
	            document.getElementById('viewport').appendChild(render_stats.domElement);
	
	            // 创建带有物理引擎的场景，并设置重力系数
	            scene = new Physijs.Scene;
	            scene.setGravity(new THREE.Vector3(0, -50, 0));
	
	            // 创建远景透视相机，设定相机位置，设定相机焦点，添加相机到场景之中
	            camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
	            camera.position.set(50, 30, 50);
	            camera.lookAt(new THREE.Vector3(10, 0, 10));
	            scene.add(camera);
	
	            // 创建锥形光源，设定光源位置。添加光源到场景之中
	            light = new THREE.SpotLight(0xFFFFFF);
	            light.position.set(20, 100, 50);
	            scene.add(light);
	
	            // 调用createGround()方法创建地板与四周挡板
	            createGround();
	
	            // 调用getPoint方法返回骨牌坐标位置数组。声明骨牌数组
	            var points = getPoints();
	            var stones = [];
	
	            // 添加动画
	            requestAnimationFrame(render);
	
	            // 声明控制器
	            var controls = new function () {
	                // 设定实例中重力矢量
	                this.gravityX = 0;
	                this.gravityY = -50;
	                this.gravityZ = 0;
	
	                // 定义resetScene场景重置方法
	                this.resetScene = function () {
	
	                    scene.setGravity(new THREE.Vector3(controls.gravityX, controls.gravityY, controls.gravityZ));
	                    stones.forEach(function (st) {
	                        scene.remove(st)
	                    });
	                    stones = [];
	
	                    points.forEach(function (point) {
	                        var stoneGeom = new THREE.BoxGeometry(0.6, 6, 2);
	
	                        var stone = new Physijs.BoxMesh(stoneGeom, Physijs.createMaterial(new THREE.MeshPhongMaterial(
	                            {
	                                color: scale(Math.random()).hex(),
	                                transparent: true, opacity: 0.8,
	//                            map: THREE.ImageUtils.loadTexture( '../assets/textures/general/darker_wood.jpg' )
	                            })));
	                        console.log(stone.position);
	                        stone.position.copy(point);
	                        stone.lookAt(scene.position);
	                        stone.__dirtyRotation = true;
	                        stone.position.y = 3.5;
	
	                        scene.add(stone);
	                        stones.push(stone);
	
	                    });
	
	                    // let the first one fall down
	                    stones[0].rotation.x = 0.2;
	                    stones[0].__dirtyRotation = true;
	
	                };
	            };
	
	            var gui = new dat.GUI();
	            gui.add(controls, 'gravityX', -100, 100);
	            gui.add(controls, 'gravityY', -100, 100);
	            gui.add(controls, 'gravityZ', -100, 100);
	            gui.add(controls, 'resetScene');
	
	            controls.resetScene();
	        };
	
	        var stepX;
	
	        // 定义渲染函数render
	        render = function () {
	            requestAnimationFrame(render);
	            renderer.render(scene, camera);
	            render_stats.update();
	
	            scene.simulate(undefined, 1);
	        };
	
	        // 获得多米诺位置坐标数组
	        function getPoints() {
	            // 声明一个点集储存位置点，声明半径，声明圆心的X/Y位置
	            var points = [];
	            var r = 27;
	            var cX = 0;
	            var cY = 0;
	            // 声明偏移量
	            var circleOffset = 0;
	            // i是角度，总共1000度。由于圆圈不断变小，i的增量为6度 + 偏移量
	            for (var i = 0; i < 1000; i += 6 + circleOffset) {
	                // 偏移量计算公式
	                circleOffset = 4.5 * (i / 360);
	                // 坐标位置 = 半径 * 三角函数 + 圆心，半径随角度增加而减小
	                var x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
	                var z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
	                var y = 0;
	                // 将坐标添加到数组
	                points.push(new THREE.Vector3(x, y, z));
	            }
	            // 返回坐标数组
	            return points;
	        }
	
	        // 创建地板
	        function createGround() {
	            // 创建地板材料，调用Physijs.createMaterial方法，传入参数threejs材料，摩擦系数，变形恢复能力
	            var ground_material = Physijs.createMaterial(
	                new THREE.MeshPhongMaterial({
	                    map: THREE.ImageUtils.loadTexture('data/bathroom.jpg')
	                }), .9, .3);
	            // 创建地板，调用BoxMesh方法使物理引擎把几何体当作盒子来进行各种处理，
	            // 传入参数为threejs几何体、物理引擎材料、网格数量（？）
	            var ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), ground_material, 0);
	            // 创建地板四周的挡板，设置地板位置，添加地板到场景
	            var borderLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), ground_material, 0);
	            borderLeft.position.x = -31;
	            borderLeft.position.y = 2;
	            ground.add(borderLeft);
	
	            var borderRight = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), ground_material, 0);
	            borderRight.position.x = 31;
	            borderRight.position.y = 2;
	            ground.add(borderRight);
	
	            var borderBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), ground_material, 0);
	            borderBottom.position.z = 30;
	            borderBottom.position.y = 2;
	            ground.add(borderBottom);
	
	            var borderTop = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), ground_material, 0);
	            borderTop.position.z = -30;
	            borderTop.position.y = 2;
	            ground.add(borderTop);
	
	            scene.add(ground);
	        }
	
	
	        window.onload = initScene;
	
	    </script>
	</head>
	
	<body>
	<div id="viewport"></div>
	</body>
	
	</html>
