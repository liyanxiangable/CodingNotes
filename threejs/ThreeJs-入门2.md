---
title: ThreeJs 入门2
date: 2017-07-07 09:33:47
tags:
---

# 创建场景 #

我们已经知道，一个场景想要显示任何东西都需要三种类型的组件：
1. 相机： 决定那些东西要在屏幕上渲染
2. 光源： 他们会对材质如何显示，以及生成阴影时材质如何使用产生影响
3. 物体： 他们是在相机透视图里主要的渲染对象

THREE.Scene() 对象就是上述所有对象的容器。