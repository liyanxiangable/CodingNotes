---
title: VueJS学习八个-表单控件绑定
date: 2017-03-30 13:12:12
tags:
---

一、基础用法：

你可以用 v-model 指令在表单控件元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。v-model 本质上不过是语法糖，它负责监听用户的输入事件以更新数据，并特别处理一些极端的例子。
v-model 并不关心表单控件初始化所生成的值。因为它会选择 Vue 实例数据来作为具体的值。
对于要求输入法编辑器(Input Method Editor)的语言，你会发现那v-model不会在 ime 构成中得到更新。如果你也想实现更新，请使用 input事件。


二、绑定value：

对于单选按钮，勾选框及选择列表选项， v-model 绑定的 value 通常是静态字符串（对于勾选框是逻辑值）。但是有时我们想绑定 value 到 Vue 实例的一个动态属性上，这时可以用 v-bind 实现，并且这个属性的值可以不是字符串。

1. 复选框：
	`<input
	  type="checkbox"
	  v-model="toggle"
	  v-bind:true-value="a"
	  v-bind:false-value="b"
	>
	// 当选中时
	vm.toggle === vm.a
	// 当没有选中时
	vm.toggle === vm.b`

2. 单选按钮：
	`<input type="radio" v-model="pick" v-bind:value="a">
	// 当选中时
	vm.pick === vm.a`

3. 选择列表设置：
	`<select v-model="selected">
    <!-- 内联对象字面量 -->
	  <option v-bind:value="{ number: 123 }">123</option>
	</select>
	// 当选中时
	typeof vm.selected // -> 'object'
	vm.selected.number // -> 123`


三、修饰符

1. .lazy
在默认情况下，v-model 在 input 事件中同步输入框的值与数据，但你可以添加一个修饰符 lazy ，从而转变为在 change 事件中同步：
	`<!-- 在 "change" 而不是 "input" 事件中更新 -->
	<input v-model.lazy="msg" >`

2. .number
如果想自动将用户的输入值转为 Number 类型（如果原值的转换结果为 NaN 则返回原值），可以添加一个修饰符 number 给 v-model 来处理输入值：
	`<input v-model.number="age" type="number">`

3. .trim
如果要自动过滤用户输入的首尾空格，可以添加 trim 修饰符到 v-model 上过滤输入：
	`<input v-model.trim="msg">`

