---
title: VueJS学习二个
date: 2017-03-29 19:16:18
tags:
---

一、构造器：

每个 Vue.js 应用都是通过构造函数 Vue 创建一个 Vue 的根实例启动的：
	`var vm = new Vue({
	  // 选项
	})`
在实例化 Vue 时，需要传入一个选项对象，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。
可以扩展 Vue 构造器，从而用预定义选项创建可复用的组件构造器：
    `var MyComponent = Vue.extend({
	  // 扩展选项
	})
	// 所有的 `MyComponent` 实例都将以预定义的扩展选项被创建
	var myComponentInstance = new MyComponent()`
尽管可以命令式地创建扩展实例，不过在多数情况下建议将组件构造器注册为一个自定义元素，然后声明式地用在模板中。所有的 Vue.js 组件其实都是被扩展的 Vue 实例。
这一段讲的好抽象，等过段时间再来看看。


二、属性与方法

每个 Vue 实例都会代理其 data 对象里所有的属性：
	`var data = { a: 1 }
	var vm = new Vue({
	  data: data
	})
	vm.a === data.a // -> true
	// 设置属性也会影响到原始数据
	vm.a = 2
	data.a // -> 2
	// ... 反之亦然
	data.a = 3
	vm.a // -> 3`
注意只有这些被代理的属性是响应的。如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。
除了 data 属性， Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 $，以便与代理的 data 属性区分。例如：
	`var data = { a: 1 }
	var vm = new Vue({
	  el: '#example',
	  data: data
	})
	vm.$data === data // -> true
	vm.$el === document.getElementById('example') // -> true
	// $watch 是一个实例方法
	vm.$watch('a', function (newVal, oldVal) {
	  // 这个回调将在 `vm.a`  改变后调用
	})`
即vm.$data是绑定的数据对象，vm.$el是id为example的DOM元素对象。


三、实例生命周期：

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如，实例需要配置数据观测 (data observer)、编译模版、挂载实例到 DOM ，然后在数据变化时更新 DOM 。钩子在实例生命周期的不同阶段调用，如 created、mounted、updated、destroyed 。钩子的 this 指向调用它的 Vue 实例。


四、生命周期：

![](https://cn.vuejs.org/images/lifecycle.png)

Vue实例生命周期如图。