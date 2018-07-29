---
title: ThreeJs制作打砖块游戏1
date: 2017-07-14 17:11:45
tags:
---

首先进行初始化，这个就不多讲了，前边都说过。然后有一点就是添加相机的鼠标控制，这个非常简单，就是利用了OrbitControl.js。如下：
    var controller = new THREE.OrbitControls(camera);
    controller.update(deltaTime);
然后，我想我以前的做法都是按照软件的使用流程来进行软件的编写。虽然也有规划，但是想到哪里才写哪里，感觉这样不好。所以现在我想函数式编程，先考虑软件的流程，需要实现哪些方法，再对函数进行实现。以下是暂时想到的功能：
进入游戏初始化			initGame()
发球						serveBall()
球拍移动					moveRacket()
球在球拍上移动			moveBall()
计算球的运动角度与速度		ballAngularAndVelocity()
球的运动反射				reflectBall()
//球的碰撞检测				collisionBall()
打砖块效果				hitBrick()
加分得分					updateScore()
丢球						loseBall()
接球						getBall()
生命系统					ballStorage()
新的球					newBall()
结束游戏					gameOver()
所以现在程序大体是这个样子:
下面中有球监听的事件，只是表示在物理引擎循环之中，并不代表真的进行监听，物体也没法进行监听。具体怎样的实现还是要看physijs的api。
    function initGame() {
        // 各种初始化操作
        moveBall();
        moveRacket();
    }

    function ballAngularAndVelocity() {
        // 计算发球角度与速率
        serveBall();
    }

    function hitBrick() {
        // 打砖块效果
        updateScore();
    }

    function loseBall() {
        ballStorage();
    }

    function ballStorage() {
        //  进行计算与判断
        newBall();
        gameOver();
    }

    function getBall() {
        moveBall();
    }

    ball.addEventListener('collisionOnRacket', function () {
        getBall();
    });

    ball.addEventListener('collisionOnWall', function () {
        reflectBall();
    });

    ball.addEventListener('collisionOnBrick', function () {
        reflectBall();
        hitBrick();
    });

    ball.addEventListener('loseBall', function () {
        loseBall();
    });

    window.onkeydown = ballAngularAndVelocity();
    window.onload = initGame()
下面知道了大体的框架，我们来做具体的实现：
首先是初始化，初始化需要创建场景、渲染器、相机、控制器等。还要生成球拍、球、砖块、灯光等。另外还有必要的参数。我一开始弄错了，这里要注意使用physijs之后的几何体的创建方式需要进行改变。以下是官方给出的例子：
	var mesh = new Physijs.SphereMesh(
	    new THREE.SphereGeometry( 3 ),
	    new THREE.MeshBasicMaterial({ color: 0x888888 })
	);
	mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
	});
可以看到，在使用physijs物理引擎之后，创建几何体的Mesh方法被替换为了physijs中的方法。这样可以在几何体上添加监听器，可以监听碰撞事件，然后就可以调用回调函数。回调函数接收4个参数，分别是另一个被碰撞的几何体，两个碰撞物体的相对速度、两物体的相对角速度与两个碰撞几何体的接触点法线。
我们想要实现像光线一样的碰撞反射效果，需要什么呢？首先是速度，这个碰撞监听事件参数中有。其次是入射角，因为反射角等于入射角，所以没有入射角就不能进行碰撞的反射，但是现在碰撞实践中并没有这个参数，所以我觉得可以创建一个运动方向的变量或者是属性。
	var direction
并且需要引入physijs、ammojs库并且创建线程。
    Physijs.scripts.worker = 'js/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
我们在初始化中创建各种必须的配置：
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xbfd1e5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.x = xlength/2;
    camera.position.y = ylength/2;
    camera.position.z = 400;

    var axes = new THREE.AxisHelper(30);
    scene.add(axes);

    controller = new THREE.OrbitControls(camera);
    controller.center.x = xlength/2;
    controller.center.y = ylength/2;
    //controller.center.z = 500;

    var plane = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(xlength, ylength),
        new THREE.MeshLambertMaterial({color: 0x44cc88}),
        0
    );
    plane.position.x = xlength/2;
    plane.position.y = ylength/2;
    plane.position.z = -radius;
    scene.add(plane);

    var ambientLight = new THREE.AmbientLight(0x007733);
    scene.add(ambientLight);

    var ball = new Physijs.SphereMesh(
        new THREE.SphereGeometry(radius, 10, 10),
        new THREE.MeshLambertMaterial({color: 0x225599}),
        0
    );
    camera.lookAt(plane.position);
    scene.add(ball);

    //moveBall();
    //moveRacket();

    document.getElementById('gl').appendChild(renderer.domElement);
    render();
其中要讲一下关于相机与相机控制位置的关系。相机的位置是上边camera.position规定的，如果在其他的地方没有改变，那么相机的位置就是固定的。而OrbitControls则是另外的配置，可以设置一个中心，当我们使用鼠标进行控制的时候，我们的相机的位置就围绕着这个中心旋转。半径就是这个中心到当前相机的位置。
现在有一个问题就是球与球拍的关系。我认为是需要一个约束的，但是约束在一些情况下应当去掉，去掉约束在physijs中的操作的代码为：
	Physijs.Scene.prototype.removeConstraint = function( constraint ) {
		if ( this._constraints[constraint.id ] !== undefined ) {
			this.execute( 'removeConstraint', { id: constraint.id } );
			delete this._constraints[ constraint.id ];
		}
	};
