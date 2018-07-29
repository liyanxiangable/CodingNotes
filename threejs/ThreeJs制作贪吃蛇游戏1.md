---
title: ThreeJs制作贪吃蛇游戏1
date: 2017-07-10 10:44:41
tags:
---

大体地熟悉了一下threejs，想要先写几个小demo。首先是贪吃蛇，做这个是为了快速熟悉threejs常用的命令代码。然后就是打方块游戏，熟悉一下碰撞检测算法。

首先是贪吃蛇。我首先做一个平面内的游戏，之后有时间再考虑空间内的贪吃蛇游戏。
所以，首先要有一个平面，作为贪吃蛇运行的基准面。基准面分成相等大小的方格。
贪吃蛇由一些列方块组成。开始的时候，贪吃蛇长度为3或者4个方格。接收到反向按钮的指令后开始向对应当向移动。首先，在贪吃蛇没有增长且自由移动的情况下，贪吃蛇的移动的过程应当是下面这个样子的：首先判断有没有方向指令，如果没有的话，下一次刷新按照之前的方向进行移动。如果有方向的话，按照新的指令进行移动。由于贪吃蛇的身子是由若干个小立方体构成的，并且贪吃蛇的身体应当连贯。现假设一个长度为N的贪吃蛇的各个小立方体的编号分别为0、1、2、……、N-1。而其中1到N-1个立方体，也就是除了贪吃蛇的头的其他的位置，他们下次的移动到的位置是他们前驱的上一次刷新的位置。也就是说他们的位置与方向指令没有关系。与方向指令有关系的只有贪吃蛇的头部。再来考虑贪吃蛇头部运动位置：首先贪吃蛇的指令方向一共有四个，分别是上下左右。但是在运动过程中，有效的运动方向指令却只有三个或者说两个，因为首先贪吃蛇不能倒着走，其次当指令方向为贪吃蛇现有的运动方向的时候贪吃蛇的方向并不会有变化。至于贪吃蛇头部的位置应当移动到哪里，这个在之后的细节处考虑。
移动的时候有个速度，应当是贪吃蛇的刷新速度。这个速度应当根据当前的难度可调。开始的时候不用太关心这个，等实现了基本功能之后再考虑刷新速度问题。
正常情况下，食物应当在同一时间内只有一个，当贪吃蛇吃掉食物的时候，食物进行位置的刷新。食物的位置是随机分配的。
当贪吃蛇碰撞到墙壁的时候，即移动出基准面的时候，即判定游戏结束。
哦对，应当还有一个计分的功能。
以上的几个功能中，食物刷新，计分刷新与判断游戏结束应当是贪吃蛇移动之后所进行判断的。
然后就是贪吃蛇的移动，贪吃蛇在两次刷新的时候，所接受到的最后一条方向命令左右有效的命令。直到进行下一次移动的时候，命令生效。
还有就是贪吃蛇的增长，当贪吃蛇吃到食物的时候，他的长度增长一格。怎么增长呢？可以从头部增长，也可以从尾部增长。为了保持代码的一致性，我们在尾部进行增长。这样的话，让贪吃蛇之前的N个小立方体正常移动，将地、第N+1个新的小立方体添加到没有增长之前的第N个（即尾部）的位置。

以上是大体的想法，下面进行细节的实现，其中有什么不合适的地方再进行修改。
现在制作一个流程图。
发现有问题，开始的时候不能等待用户输入指令，因为用户不知道哪里是头哪里是尾，而贪吃蛇不能反方向走。当然指定一个特殊的头部来进行区分也是可以的，但是这并不能阻止用户输入反方向指令。所以最好还是给贪吃蛇一个初始的移动方向。
另外有一点忘了，就是游戏失败了还有一种情况，就是当贪吃蛇碰到自己的时候。
目前大体是这个样子。流程图如下：
![](http://i.imgur.com/HN88z0e.png)
下面根据以上的各种流程与逻辑来编写代码：

1. 初始化：
现在我先假定贪吃蛇的基准面大小是一个长方形，尺寸为40*25个立方体。然后每个立方体的边长为2.
界面初始化：
    // 资源加载完毕的时候就进行初始化
    function init() {
        // 初始化场景
        var scene = new THREE.Scene();

        // 初始化相机
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // 初始化渲染器
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x444444);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 添加一个坐标轴辅助定位，红色为X，绿色为Y，蓝色为Z
        var axes = new THREE.AxisHelper(30);
        scene.add(axes);

		// 设定立方体的单位长度，设定基准面等尺寸
		var unit = 2;
		var planeLength = 40;
		var planeWidth = 25;

        // 初始化基准面
        var planeGeometry = new THREE.PlaneGeometry(unit * planeLength, unit * planeWidth, 1, 1);
        var planeMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(plane);

        // 平面默认是在X-Y平面上的。我们让他相对于我们的视角（相机）水平
        // 进行绕X轴的旋转。旋转方向，是从轴的正方向一点向原点看去，逆时针为正
        plane.rotation.x = -0.5 * Math.PI;

        // 添加WebGL显示元素，进行渲染
        document.getElementById('webgl').appendChild(renderer.domElement);
        renderer.render(scene, camera);
    }
    window.onload = init;
然后我们进行调整
    // 我们把基准面的一点与坐标轴原点进行对齐，这样方便计算。现在让平面完全在X-Z面正半轴
    plane.position.x = unit * planeLength / 2;
    plane.position.y = 0;
    plane.position.z = unit * planeWidth / 2;
然后我想显示网格，来帮助玩家控制路线的对齐。需要使用GridHelper这个类。
    // 添加辅助网格，但是这个有个缺点，就是不能（我没有找到）控制网格形状的属性或方法，只能制作正方形
    var gird = new THREE.GridHelper(unit * planeLength, planeLength, 0x123456, 0x654321);
    gird.position.x = unit * planeLength / 2;
    gird.position.y = 0;
    gird.position.z = unit * planeLength / 2;
    scene.add(gird);
下面生成贪吃蛇。我想让它长度为4，开始的时候放置在平面的中间。这样他的位置也容易测定了。有一点需要注意，虽然贪吃蛇是一条蛇，但是应当把分成一个个的小的立方体，来支持贪吃蛇形状的变化。我用一个数组来把所有的组成贪吃蛇的小立方体放进去。然后将他们分别加入场景。
    // 初始化贪吃蛇
    var snake = [];

    for (var i = 0; i < 4; ++i) {
        var snakeCubeGeometry = new THREE.CubeGeometry(1, 1, 1);
        var snakeCubeMaterial = new THREE.MeshBasicMaterial({color: 0x003388});
        var snakeCube = new THREE.Mesh(snakeCubeGeometry, snakeCubeMaterial);
        snakeCube.position.x = 22 - i * unit;
        snakeCube.position.y = 0.5;
        snakeCube.position.z = 12.5;
        snakeCube.name = 'snakeCube' + snake.length;
        snake.push(snakeCube);
    }

    snake.forEach(function (snakeCube) {
        scene.add(snakeCube);
    });
这样初始化的部分的基本内容就完成了。
2. 接受指令：
我们想用电脑键盘的上下左右键来控制：
首先应当响应键盘按键事件，上下左右方向键的按键码为37到40。如下：
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                alert("left");
                break;
            case 38:
                alert("up");
                break;
            case 39:
                alert("right");
                break;
            case 40:
                alert("down");
                break;
        }
    }
下面就有一个问题，我们要进行控制的指令是基于一个绝对坐标系（基于一个不动的相机的观察视角）的还是相对于贪吃蛇本身的。这两种方式区别很大，我一开始想错了，此处删掉了一大段。这里应当使用绝对坐标系，因为如果是相对于贪吃蛇本身的方向，那么也就不存在上下，只有左右。当然也可以增加相对于贪吃蛇本身的控制以增加游戏的可玩性，但这是之后要考虑的。
之前我们已经分析过，方向的控制是只控制贪吃蛇的头部，下面我们就贪吃蛇所接受到的不同指令进行分析：
在不考虑指令是否有效与不考虑除了头部之外贪吃蛇其他部位的情况下，贪吃蛇的头部的小立方体在空间内（基准面上）自由移动。首先，贪吃蛇有一个原有的运动方向，在这里分别用上下左右来表示原有运动方向的Z轴负方向、Z轴正方向、X轴负方向、X轴正方向。这与我们从Y轴正方向某一点看基准面时是一样的（右手坐标系进行旋转，食指指向眼睛，大拇指指向右侧、中指指向下）。
分四种情况讨论：
左指令就是将贪吃蛇头部向X轴负方向移动一个单位；右指令就是将贪吃蛇头部向X轴正方向移动一个单位；上指令就是将贪吃蛇头部向Z轴负方向移动一个单位；下指令就是将贪吃蛇头部向Z轴负方向移动一个单位。
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                snake[0].position.x -= unit;
                break;
            case 38:
                snake[0].position.z -= unit;
                break;
            case 39:
                snake[0].position.x += unit;
                break;
            case 40:
                snake[0].position.z += unit;
                break;
        }
    }
现在已经改变了贪吃蛇头部的位置，另外还需要处理贪吃蛇除了头部以外的身体的位置。我们之前分析过，就是将贪吃蛇的第N个小立方体的位置更新成为之前第N-1个小立方体的位置。所以添加代码如下：
这里有个地方要注意一下，我一开始写成了这个样子：
    for (var i = 1; i < snake.length; ++i) {
        snake[i].position.x = snake[i - 1].position.x;
        snake[i].position.y = snake[i - 1].position.y;
        snake[i].position.z = snake[i - 1].position.z;
    }
这是不行的，因为前边的内容已经修改了，所以得到的不是更新之前的前驱的位置，而是更新之后的前驱的位置。这样的话所有的小立方体的坐标会挤在一起。正确的方法是，如果使用没有改变之前的前驱数据，则应当从后向前进行位置的更新。
    // 遍历整个snake数组，将位置改变
    for (var i = snake.length - 1; i > 0; --i) {
        
        snake[i].position.x = snake[i - 1].position.x;
        snake[i].position.y = snake[i - 1].position.y;
        snake[i].position.z = snake[i - 1].position.z;
        
    }
做到这里我有个想法，就是实现贪吃蛇的移动，到底是将后继放置到更新前的前去的位置好，还是将最后一个小立方体直接放置在原来的贪吃蛇头部位置好。虽然前者方法理论上复杂度是O(n)，后者的复杂度是0(1)。但是后者怎么判断最后一个小立方体是个问题，因为如果按照后者的方法，只是最后一个小立方体的位置发生了变化，但是他在snake这个数组的内部还是最后一个元素的。所以我的想法是每次在最后一个元素这里添加一个标志。这样需要设置属性，并且还是要进行遍历来寻找最后一个（名义上的、在浏览器中看到的最后一个）小立方体。所以我感觉第二种更新贪吃蛇位置的方法可以之后尝试一下，目前来看先试用第一种方法吧。

3. 位置更新。
这个方向控制操作是独立于webgl刷新与更新的。所以接下来我们制作贪吃蛇位置的更新。贪食蛇更新应当有一个时间间隔，每过一个时间间隔，就将贪吃蛇的位置进行更新，从而再进行接下来的各种判断与操作。这个功能的实现可以借助于setInterval或者requestAnimationFrame函数。这里使用可以设定时间间隔的setInterval函数。
    function render() {

        changePosition();

        renderer.render(scene, camera);
        
    }
然后到这里我们就要解决一个历史遗留问题，就是之前的接受控制的时候，贪吃蛇的头部的位置是立即进行改变的。但是我们应当让他在事件间隔之后与其他的小立方体一起进行改变。还有就是玩家有可能在一个时间间隔之内输入了多个指令，我们需要对这样的情况进行处理。而且我们还应当考虑没有输入方向指令的时候的默认的前进的情况，所以应当添加一个新的函数来管理这些事情：
首先就要判断输入的指令是否有效。那么什么是有效的指令呢？顺着当前移动方向与逆向的这两个方向是无效的，也就是说只有相对于贪吃蛇运动的左右方向是有效的。那么还需要知道当前的运动方向。我们新增一个方向变量。规定他的值为1、2、3、4，分别表示上、左、下、右这四个方向。那么开始的时候，我们默认让贪吃蛇的移动方向为向右：
    // 运动方向
    var direction = 4;
那么就需要根据当前的运动方向判断指令是否有效：
我这里一开始出了错误，从新整理一下。运动方向上、左、下、右放别是1、2、3、4。
键盘码37、38、39、40分别表示指令左、上、右、下。
所以当方向为上（1）、下（3）的时候，左（37）、右（38）的方向指令是有效的。当方向为左（2）、右（4）的时候，上（38）、下（40）的方向指令是有效的。
    function isValidDirection(keycode) {
        // 当运动方向是向上向下的时候，左右方向有效
        if (direction === 1 || direction === 3) {
            if (keycode === 37 || keycode === 39) {
                return true;
            }
        }
        if (direction === 2 || direction === 4) {
            if (keycode === 38 || keycode === 40) {
                return true;
            }
        }
        return false;
    }
接下来我们不在收到方向指令之后立即修改贪吃蛇头的位置，而是等待时间走完一个间隔的时候改变位置。
现在的流程是我们获取了方向的指令，直接改变位置。所以现在我的想法是在setInterval的调用函数render之中进行位置的改变，而我们之前的changeDirection中是直接改变了位置，所以我想把这里改成位置的改变信息，传递给之后的render中，改变位置。
    // 新的贪吃蛇头部位置
    var newHeadPosition = {
        x: null,
        //y: null,
        z: null
    };
然后将位置改变增量进行储存，并改变运动方向。例如：
    newHeadPosition.x =  - unit;
    newHeadPosition.z = 0;
	direction = 2;
所以说这个newHeadPosition会一直保存贪吃蛇的移动信息，如果没有输入方向控制的话，那么就按照之前的方向移动。
最后在changePosition函数中进行贪吃蛇头部位置的改变：
    snake[0].position.x += newHeadPosition.x;
    snake[0].position.z += newHeadPosition.z;
试验一下，发现一开始的时候，贪吃蛇的身子往前移动，但是由于没有接收到移动方向的指令，贪吃蛇的头部并没有改变位置。这样就导致了贪吃蛇的所有小立方体挤在一起的情况，这是不对的。我们应该在开始的时候触发一个键盘事件。让贪吃蛇接收到运动方向的指令。
由于不同浏览器的模拟事件的方式不同，所以模拟事件代码可能比较繁琐。或者算了，用其他的方式解决吧。将newHeadPosition这个对象的初始值就修改为向右移动的值：
    // 新的贪吃蛇头部位置
    var newHeadPosition = {
        x: unit,
        //y: null,
        z: 0
    };
这样贪吃蛇的移动大体上完成了。后面的内容之后再讲。