
---
title: PhysiJS-代码研读-2
date: 2017-07-13 16:24:52
tags:
---

在physijs物理引擎中，可以对材质进行设置，包括restitution与friction属性。
其中friction属性是物体的摩擦系数。restitution是物体的弹性系数，就是一个对象在碰撞后复原时所具有的能量。
physijs中网格有以下几种：
PlaneMesh/ BoxMesh/ SphereMesh/ CylinderMesh/ ConeMesh/ CapsuleMesh/ ConcaveMesh/ HeighfieldMesh。
其中，PlaneMesh 没有厚度，所以固定没有质量，也就不受重力影响，并且也不支持碰撞移动。
CapsuleMesh 在threejs中没有直接对应的几何体，所以需要在threejs中创建一个圆柱体与两个半球体：
	// 创建一个threejs几何体，一个圆柱体，两个半球体。其中半球体的直径与圆柱体的直径相同
    var merged = new THREE.Geometry();
    var cyl = new THREE.CylinderGeometry(2, 2, 6);
    var top = new THREE.SphereGeometry(2);
    var bot = new THREE.SphereGeometry(2);
	// 创建一个4X4的变换矩阵，设置这个矩阵为平移变换。并使半球体施加这个坐标变换。
    var matrix = new THREE.Matrix4();
    matrix.makeTranslation(0, 3, 0);
    top.applyMatrix(matrix);
    var matrix = new THREE.Matrix4();
    matrix.makeTranslation(0, -3, 0);
    bot.applyMatrix(matrix);
    // 将三个几何体合并几何图形成总体
    merged.merge(top);
    merged.merge(bot);
    merged.merge(cyl);
    // 创建一个physijs的网格，将总体的模型传入。
    var capsule = new Physijs.CapsuleMesh(
            merged,
            getMaterial()
    );
但是这个变换矩阵这里我还不理解，这个应当补一下计算机图形学的知识。
ConvexMesh 是一个凸包网格，凸包是包围某个几何体所有顶点的最小几何体。显然几何体的夹角都小于180度。
HeightfieldMap 是高度场网格：
	// 设置材料
    var ground_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('../assets/textures/ground/grasslight-big.jpg')}),.3, .8);
	// 创建threejs几何体
    var ground_geometry = new THREE.PlaneGeometry(120, 100, 100, 100);
	// 遍历所有顶点数组。每个点处生成一个随机值所以顶点的Z坐标。
    for (var i = 0; i < ground_geometry.vertices.length; i++) {
        var vertex = ground_geometry.vertices[i];
        var value = pn.noise(vertex.x / 10, vertex.y / 10, 0);
        vertex.z = value * 10;
    }
	// 保证正确的渲染光照、纹理、阴影
    ground_geometry.computeFaceNormals();
    ground_geometry.computeVertexNormals();
	// 创建出几何体并对其进行位姿调整。
	// 最后两个参数为水平、初值分段数，应与threejs几何体PlaneGeometry构造函数中的最后两个参数相同
    var ground = new Physijs.HeightfieldMesh(ground_geometry, ground_material, 0, 100, 100);
    ground.rotation.x = Math.PI / -2;
    ground.rotation.y = 0.4;
    ground.receiveShadow = true;

Physijs 还提供了一些运动约束。如 PointConstraint/ HingeConstraint/ SliderConstraint/ ConeTwistConstraint/ DOFConstraint。
1. 刚性约束 PointConstraint
这种约束使得几何体对象与另一个对象或固定点连在一起，距离保持不变。重力、摩擦、弹性效果不变。
	// 前两个参数是要连接的对象，第三个参数指定约束绑定的位置。
    var constraint = new Physijs.PointConstraint(objectOne, objectTwo, objectTwo.position);
	// 在场景中启用约束
    scene.addConstraint(constraint);
2. 铰链约束 HingeConstraint
	// 约束接收四个参数：mashA表示被约束的对象，meshB表示meshA受哪个对象约束，position表示约束应用的点，即meshA绕着哪里旋转。axis表示活页绕着旋转的轴。
    var constraint = new Physijs.HingeConstraint(flipperLeft, flipperLeftPivot, flipperLeftPivot.position, new THREE.Vector3(0, 1, 0));
    scene.addConstraint(constraint);
调用setLimit函数来设置约 HingeConstraint 约束的属性：
    constraint.setLimits(
            -2.2, // 旋转的最小角度, 按照弧度计算
            -0.6, // 旋转的最大角度, 按照弧度计算
            0.1, // 当被约束对象在错误位置的时候，结束进行修正的速度
            0 // 振动特性
    );
这种约束可以由内部的马达进行驱动：
	// 设定马达的速度，加速度。之后关闭马达。
    flipperLeftConstraint.enableAngularMotor(controls.velocity, controls.acceleration);
    flipperRightConstraint.disableMotor();
3. 滑动约束 SliderConstraint
可以将某个对象的运动限制在一个轴上：
	// 传入参数分别为滑块、可选约束施加对象、约束应用位置、移动方向向量
    var constraint = new Physijs.SliderConstraint(sliderMesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    scene.addConstraint(constraint);
创建并添加约束之后，还可以对约束加以修饰。
	// 设置滑动约束的线性下限、线性上限、角度上限、角度下限
    constraint.setLimits(-10, 10, 0, 0);
	// 设置达到滑动限定值时的反弹：达到线性限制时的弹性、达到角度限制时的弹性
    constraint.setRestitution(0.1, 0.1);
4. 球销约束 ConeTwistConstrain
可以指定一个对象绕另一个对象转动时在X/Y/Z轴上的最小角度和最大角度：
	// 运动（被约束）对象、施加约束对象、约束应用的位置
    var constraint = new Physijs.ConeTwistConstraint(objectOne, objectTwo, objectOne.position);
    scene.addConstraint(constraint);
    // 对约束进行设置，分别是X/Y/Z轴的最大转角
    constraint.setLimit(0.5 * Math.PI, 0.5 * Math.PI, 0.5 * Math.PI);
	// 设置马达施加的力与运动方向
    constraint.setMaxMotorImpulse(1);
    constraint.setMotorTarget(new THREE.Vector3(0, 0, 0)); // desired rotation
5. 自由度约束 DOFConstraint：
DOFConstraint 约束可以同时约束线性移动（平动）与角度移动（转动）。但是有一点我不明白，就是要把一个物体约束在另一个物体上，比如说车轮约束在车身上，那么他们的约束的位置与轴怎么表示，下面的例子中的点的位置与轴的位置都是固定的，但是小车是移动的。当然也有可能是约束的移动之前的位置，然后物理引擎自动根据小车的移动来计算当前位置的约束条件。但是转动轴怎么算呢？
以下是bulletPhysics的说明：
关于hingeConstraint：
The pivot and axis in A/B are all expressed in local coordinate of Object A/B. For a door, even if we lay down the door, axisInA/B is still (0,1,0). 
As long as the constraint structure doesn't change, the local coordinates won't change.
所以说转轴是在局部坐标系表示的。比如对于一个门来说，即便是把门横着放，这个转轴还是(0, 1, 0)。只要约束的结构不会变化，局部坐标系就不会改变。
Normally two axis in hinge-connected objects should align and point to the same direction, such as a door. But you can set two axis as different vectors.
一般情况下铰链约束中的两个轴应当共线并且朝向一个方向，就像门的结构一样。但是你能够将两个轴设定不同的向量。
关于DOFConstriant:
This generic constraint can emulate a variety of standard constraints, by configuring each of the 6 degrees of freedom (DoF). The first 3 DoF axis are linear axis, which represent translation of rigid bodies, and the latter 3 axis represent the angular motion. Each axis can be either locked, free or limited. Note that several combinations that include free and/or limited angular degrees of freedom are undefined. 
这种约束可以通过对六自由度的限制来对那些标准的约束进行替代。前三个自由度是线性运动的轴，表示物体的平动，后三个轴代表角位移。每一个轴都可以被禁止移动、自由运动、限制移动。应当注意包括自由运动或是限制运动的的结合是未定义的。
github例子如下：
	var constraint = new Physijs.DOFConstraint(
	    physijs_mesh_a, // First object to be constrained
	    physijs_mesh_b, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
	    new THREE.Vector3( 0, 10, 0 ), // point in the scene to apply the constraint
	);
	scene.addConstraint( constraint );
	constraint.setLinearLowerLimit( new THREE.Vector3( -10, -5, 0 ) ); // sets the lower end of the linear movement along the x, y, and z axes.
	constraint.setLinearUpperLimit( new THREE.Vector3( 10, 5, 0 ) ); // sets the upper end of the linear movement along the x, y, and z axes.
	constraint.setAngularLowerLimit( new THREE.Vector3( 0, -Math.PI, 0 ) ); // sets the lower end of the angular movement, in radians, along the x, y, and z axes.
	constraint.setAngularUpperLimit( new THREE.Vector3( 0, Math.PI, 0 ) ); // sets the upper end of the angular movement, in radians, along the x, y, and z axes.
	constraint.configureAngularMotor(
	    which, // which angular motor to configure - 0,1,2 match x,y,z
	    low_limit, // lower limit of the motor
	    high_limit, // upper limit of the motor
	    velocity, // target velocity
	    max_force // maximum force the motor can apply
	);
	constraint.enableAngularMotor( which ); // which angular motor to configure - 0,1,2 match x,y,z
	constraint.disableAngularMotor( which ); // which angular motor to configure - 0,1,2 match x,y,z
同时最后一个小车的例子，对车轮进行位置的约束，将4个轮子固定到车身上：
	// 被约束几何体、施加约束几何体、约束到的位置
    var frConstraint = createWheelConstraint(fr, body, new THREE.Vector3(0, 4, 8));
    scene.addConstraint(frConstraint);
对车轮进行的转轴进行约束：
这里将X/Y/Z三个轴的转动的上下线设成同一值，可以使得在三个方向上都限制住转动。然后再添加马达，如果马达启动的时候，约束的限制将不再起作用。
    frConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
    frConstraint.setAngularUpperLimit({x: 0, y: 0, z: 0});
    flConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
    flConstraint.setAngularUpperLimit({x: 0, y: 0, z: 0});
设定后边两个车轮的限制：
    rrConstraint.setAngularLowerLimit({x: 0, y: 0.5, z: 0.1});
    rrConstraint.setAngularUpperLimit({x: 0, y: 0.5, z: 0});
    rlConstraint.setAngularLowerLimit({x: 0, y: 0.5, z: 0.1});
    rlConstraint.setAngularUpperLimit({x: 0, y: 0.5, z: 0});
最后设置前轮马达：
    flConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
    frConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
启动马达：
    flConstraint.enableAngularMotor(2);
    frConstraint.enableAngularMotor(2);




参考链接：
1. [https://github.com/chandlerprall/Physijs/wiki/Constraints](https://github.com/chandlerprall/Physijs/wiki/Constraints "github-wiki")
2. [https://stackoverflow.com/questions/42873767/error-in-loading-physi-js-and-ammo-js](https://stackoverflow.com/questions/42873767/error-in-loading-physi-js-and-ammo-js)
3. [http://bulletphysics.org/mediawiki-1.5.8/index.php/Constraints](http://bulletphysics.org/mediawiki-1.5.8/index.php/Constraints "bulletPhysics")