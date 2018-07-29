---
title: ThreeJs制作贪吃蛇游戏2
date: 2017-07-10 10:44:46
tags:
---

下面开始制作食物部分。食物要求生成位置随机。
    // 初始化食物
    var food;
    // 随机分配食物位置
    function foodPosition() {
        var xPosition = Math.floor(Math.random() * 60);
        var zPosition = Math.floor(Math.random() * 60);
        food.position.x = (xPosition + 0.5) * unit;
        food.position.z = (zPosition + 0.5) * unit;
    }
当然这里是伪随机数。由于我想让贪吃蛇在网格内移动，食物因此也应当在网格内，所以统一修改他们的位置为0.5结尾（加上0.5）。现在能产生食物了，接下来对判断怎样算是吃到食物。我想，当贪吃蛇的头部达到了食物的位置，那么此时就可以算成功吃到了食物。
    // 是否吃到食物
    function eatingFood() {
        if (snake[0].position.x === food.position.x &&
                snake[0].position.z === food.position.z) {
            return true;
        } else {
            return false;
        }
    }
整个动作分为食物的消失，贪吃蛇头部移动到食物位置，生成新的食物三个步骤。但是由于不会立即及逆行渲染，而是有时间间隔，所以仅从逻辑上考虑就可以，不用考虑动画的效果。
另外还有个地方需要解决，就是食物生成的位置很有可能是在贪吃蛇的身上。这个的处理我想之后做。
怎么判断游戏是否结束呢？有两种情况，一是贪吃蛇的头部触碰到了围墙，二是贪吃蛇的头部碰到了自己的身体。判断是否碰到了围墙需要判断贪吃蛇头部单一的x坐标或者z坐标。判断贪吃蛇碰到了自己需要遍历贪吃蛇本身的除了头部之外的小立方体。
    // 是否结束游戏
    function gameOver() {
        if (snake[0].position.x === (-0.5 * unit) ||
            snake[0].position.x === (40.5 * unit) ||
            snake[0].position.z === (-0.5 * unit) ||
            snake[0].position.z === (25.5 * unit)) {
            console.log("撞墙");
            return true;
        } 
        for (var i = 1; i < snake.length; i++) {
            if (snake[i].position.x === snake[0].position.x &&
                snake[i].position.z === snake[0].position.z) {
                return true;
            }
        }
        return false;
    }
暂时不考虑贪吃蛇的增长，我们应当在每次更新的时候进行以上的计算。现在的render函数大体是这个样子的：
    function render() {
        changePosition();
        if (eatingFood()) {
            alert("EATING");
            changeFoodPosition();
            // 贪吃蛇增长
            // 积分增长
        }
        if (gameOver()) {
            alert("GAME OVER");
        }
        renderer.render(scene, camera);
    }
下面就能执行了，现在可以进行贪吃蛇长度的增长：
上一篇说过，贪吃蛇的增长有两种方式，一是递归的进行位置的变化，二是将新增的小立方体放到第二位。但是由于之前的分析，与由于我们本来的移动就是递归的，所以用第二种方法就改变了原有的程序。所以还是采用第一种方法。
并且注意到在贪吃蛇位置变化之后就丢失了最后一个小立方体原有的位置，所以增加小立方体需要在改变贪吃蛇的位置之前进行。实现增长的功能，我们需要新建一个小立方体，将他push进snake数组，并且他的位置应当是当前的最后一个小立方体位置，但是有一点好处就是，不用指定位置，因为我们的changePosition函数是在增长之后执行的。所以代码如下：
    // 贪吃蛇增长
    function grow() {
        var growCubeGeometry = new THREE.CubeGeometry(unit, unit, unit);
        var growCubeMaterial = new THREE.MeshBasicMaterial({color: 0x847623});
        var growCube = new THREE.Mesh(growCubeGeometry, growCubeMaterial);
        scene.add(growCube);
        snake.push(growCube);
    }
下面还有一个需要做的就是计分功能。并且根据当前的分数来调整游戏速度，来控制难度。这个比较好做，就不说了。
对了，结束游戏这里没有做完。判断结束游戏之后，应当清空webgl，给用户显示相应提示并给出分数。
这样基本的功能都实现了，现在对颜色、视角等细节进行修改。
最后修改之前的一点地方，就是如果快速按下不同方向的两个方向按钮，那么就会导致方向已经改变而位置没有改变的时候进行两次转弯，这时会触发自己咬到自己的情况。为了防止这种情况的发生，我们可以对输入的方向指令进行限定，要求只接受第一次的方向指令，之后的方向指令不再接受。为此，可以使用函数节流或者函数防抖。这里应当使用函数节流，话说这个方法我之前在没听说的时候就已经开始用了。感觉现在这里用这两种方法也不是很好，所以我去掉时间：
    document.onkeydown = function (event) {
        if (!received) {
            changeDirection(event);
            received = true;
        }
    }
然后在更新位置渲染的时候将received置为false。这样也可以。
现在有一个问题，就是看着非常卡。原因是我们刷新的频率太慢了，我们是跟着贪吃蛇的位置的移动来渲染的，这就导致了看起来非常的卡，一秒钟三四帧的速度。但是修改了也不行，因为我们的相机的焦点设定的就是贪吃蛇头部的位置。所以，修改了之后还是一顿一顿的。所以我现在把相机的焦点固定在一点。这样就好多了，但是又有一个问题是没有3D效果了，这就很尴尬，没有3D效果我们用threejs做什么呢？所以再来修改，这一次将相机的焦点固定在一个定点上，然后移动相机。好了！





参考链接：
1. [http://www.cnblogs.com/walls/p/6399837.html](http://www.cnblogs.com/walls/p/6399837.html "函数防抖与函数节流")
2. [http://aijezdm915.iteye.com/blog/1340838](http://aijezdm915.iteye.com/blog/1340838 "色号对照")

