---
title: VueJS学习五个-Class与Style绑定
date: 2017-03-30 08:37:21
tags:
---

数据绑定一个常见需求是操作元素的 class 列表和它的内联样式。因为它们都是属性，可以用v-bind处理它们：只需要计算出表达式最终的字符串。不过，字符串拼接麻烦又易错。因此，在 v-bind 用于 class 和 style 时，Vue.js 专门增强了它。表达式的结果类型除了字符串之外，还可以是对象或数组。

一、绑定 HTML Class：

1. 对象语法
我们可以传给 v-bind:class 一个对象，以动态地切换 class 。
	`<div v-bind:class="{ active: isActive }"></div>`
上面的语法表示类 active 的更新将取决于数据属性 isActive 是否为真值 。
我们也可以在对象中传入更多属性用来动态切换多个 class 。此外， v-bind:class 指令可以与普通的 class 属性共存。如下模板:
	`<div class="static"
	     v-bind:class="{ active: isActive, 'text-danger': hasError }">
	</div>
	data: {
	  isActive: true,
	  hasError: false
	}`
渲染为<div class="static active"></div>
上述操作也可以使用直接绑定数据里的一个对象，这个对象是对类的定义：
	`<div v-bind:class="classObject"></div>
	data: {
	  classObject: {
	    active: true,
	    'text-danger': false
	  }
	}`
我们也可以在这里绑定返回对象的计算属性。这是一个常用且强大的模式：
	`<div v-bind:class="classObject"></div>
	data: {
	  isActive: true,
	  error: null
	},
	computed: {
	  classObject: function () {
	    return {
	      active: this.isActive && !this.error,
	      'text-danger': this.error && this.error.type === 'fatal',
	    }
	  }
	}`

2. 数组语法：
我们可以把一个数组传给 v-bind:class，以应用一个 class 列表：
	`<div v-bind:class="[activeClass, errorClass]">
	data: {
	  activeClass: 'active',
	  errorClass: 'text-danger'
	}`
渲染为:
	`<div class="active text-danger"></div>`
如果想根据条件切换列表中的 class ，可以用三元表达式：
	`<div v-bind:class="[isActive ? activeClass : '', errorClass]">`
不过，当有多个条件 class 时这样写有些繁琐。可以在数组语法中使用对象语法：
	`<div v-bind:class="[{ active: isActive }, errorClass]">`


二、绑定内联样式：

1. 对象语法：
v-bind:style 的对象语法十分直观，看着非常像 CSS，其实它是一个 JavaScript 对象。CSS 属性名可以用驼峰式（camelCase）或短横分隔命名（kebab-case）：
	`<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
	data: {
	  activeColor: 'red',
	  fontSize: 30
	}`
直接绑定到一个样式对象通常更好，让模板更清晰：
	`<div v-bind:style="styleObject"></div>
	data: {
	  styleObject: {
	    color: 'red',
	    fontSize: '13px'
	  }
	}`

2. 数组语法：
v-bind:style 的数组语法可以将多个样式对象应用到一个元素上：
	`<div v-bind:style="[baseStyles, overridingStyles]">`

3. 自动添加前缀：
当 v-bind:style 使用需要特定前缀的 CSS 属性时，如 transform ，Vue.js 会自动侦测并添加相应的前缀。
