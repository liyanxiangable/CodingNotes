---
title: VueJS学习三个--模板语法
date: 2017-03-29 20:30:18
tags:
---

Vue.js 使用了基于 HTML 的模版语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。
在底层的实现上， Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，在应用状态改变时，Vue 能够智能地计算出重新渲染组件的最小代价并应用到 DOM 操作上。

一、插值：

1. 文本：
数据绑定最常见的形式就是使用 “Mustache” 语法（双大括号）的文本插值：
	`<span>Message: {{ msg }}</span>`
Mustache 标签将会被替代为对应数据对象上 msg 属性的值。无论何时，绑定的数据对象上 msg 属性发生了改变，插值处的内容都会更新。
通过使用 v-once 指令，可以执行一次性地插值，当数据改变时，插值处的内容不会更新。但这会影响到该节点上所有的数据绑定：
	`<span v-once>This will never change: {{ msg }}</span>`

2. 纯HTML：
双大括号会将数据解释为纯文本，而非 HTML 。为了输出真正的 HTML ，你需要使用 v-html 指令：
	`<div v-html="rawHtml"></div>`
被插入的内容都会被当做 HTML —— 数据绑定会被忽略。

3. 属性：
Mustache 不能在 HTML 属性中使用，应使用 v-bind 指令：
	`<div v-bind:id="dynamicId"></div>`

4. 使用JS表达式：
对于所有的数据绑定，Vue完全支持JS的表达式。
	`{{ number + 1 }}
	{{ ok ? 'YES' : 'NO' }}
	{{ message.split('').reverse().join('') }}
	<div v-bind:id="'list-' + id"></div>`
有个限制就是，每个绑定都只能包含单个表达式，所以下面的例子都不会生效：
	`<!-- 这是语句，不是表达式 -->
	{{ var a = 1 }}
	<!-- 流控制也不会生效，请使用三元表达式 -->
	{{ if (ok) { return message } }}`


二、指令：

指令（Directives）是带有 v- 前缀的特殊属性。指令属性的值预期是单一 JavaScript 表达式。指令的职责就是当其表达式的值改变时相应地将某些行为应用到 DOM 上。

1. 参数：
一些指令能接受一个 “参数”，在指令后以冒号指明。例如，v-bind 指令被用来响应地更新 HTML 属性。
	`<a v-bind:href="url"></a>`
	`<a v-on:click="doSomething">`
在这里 href 是参数，告知 v-bind 指令将该元素的 href 属性与表达式 url 的值绑定。

2. 修饰符：
修饰符（Modifiers）是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：
	`<form v-on:submit.prevent="onSubmit"></form>`


三、过滤器：

Vue.js 允许自定义过滤器，用于一些常见的文本格式化。过滤器可以用在两个地方：mustache 插值和 v-bind 表达式。过滤器应该被添加在 JavaScript 表达式的尾部，由 “管道” 符指示：
	`<!-- in mustaches -->
	{{ message | capitalize }}
	<!-- in v-bind -->
	<div v-bind:id="rawId | formatId"></div>`
过滤器可以串联：
	`{{ message | filterA | filterB }}`
过滤器是 JavaScript 函数，因此可以接受参数：
	`{{ message | filterA('arg1', arg2) }}`
这里，字符串 'arg1' 将传给过滤器作为第二个参数， arg2 表达式的值将被求值然后传给过滤器作为第三个参数。


四、缩写：

v- 前缀在模板中是作为一个标示 Vue 特殊属性的明显标识。当使用 Vue.js 为现有的标记添加动态行为时，它会很有用，但对于一些经常使用的指令来说有点繁琐。因此，Vue.js 为两个最为常用的指令提供了特别的缩写，但是感觉也没简化多少。
v-bind 缩写
	`<!-- 完整语法 -->
	<a v-bind:href="url"></a>
	<!-- 缩写 -->
	<a :href="url"></a>`
v-on 缩写
	`<!-- 完整语法 -->
	<a v-on:click="doSomething"></a>
	<!-- 缩写 -->
	<a @click="doSomething"></a>`
