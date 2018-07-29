---
title: VueJS学习九个-组件
date: 2017-03-30 15:57:07
tags:
---

组件（Component）是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素， Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 js 特性扩展。

一、使用组件：

1. 注册：
创建一个实例，
	`new Vue({
	  el: '#some-element',
	  // 选项
	})`
要注册一个全局组件，可以使用 Vue.component(tagName, options)。
	`Vue.component('my-component', {
	  // 选项
	})`
组件在注册之后，便可以在父实例的模块中以自定义元素 <my-component></my-component> 的形式使用。要确保在初始化根实例之前注册了组件：
	`<div id="example">
	  <my-component></my-component>
	</div>
	// 注册
	Vue.component('my-component', {
	  template: '<div>A custom component!</div>'
	})
	// 创建根实例
	new Vue({
	  el: '#example'
	})`

2. 局部注册：
不必在全局注册每个组件。通过使用组件实例选项注册，可以使组件仅在另一个实例 / 组件的作用域中可用：
	`var Child = {
	  template: '<div>A custom component!</div>'
	}
	new Vue({
	  // ...
	  components: {
	    // <my-component> 将只在父模板可用
	    'my-component': Child
	  }
	})`

3. DOM模板解析说明：
当使用 DOM 作为模版时, 你会受到 HTML 的一些限制，因为 Vue 只有在浏览器解析和标准化 HTML 后才能获取模版内容。尤其像这些元素 <ul> ， <ol>， <table> ， <select> 限制了能被它包裹的元素， <option> 只能出现在其它元素内部。在自定义组件中使用这些受限制的元素时会导致一些问题。
变通的方案是使用特殊的 is 属性：
	`<table>
	  <tr is="my-row"></tr>
	</table>`

4. data必须是参数：
通过 Vue 构造器传入的各种选项大多数都可以在组件里用。data 是一个例外，它必须是函数。 
假设用如下方式来绕开 Vue 的警告：
	`<div id="example-2">
	  <simple-counter></simple-counter>
	  <simple-counter></simple-counter>
	  <simple-counter></simple-counter>
	</div>
	var data = { counter: 0 }
	Vue.component('simple-counter', {
	  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
	  // 技术上 data 的确是一个函数了，因此 Vue 不会警告，
	  // 但是我们返回给每个组件的实例的却引用了同一个data对象
	  data: function () {
	    return data
	  }
	})
	new Vue({
	  el: '#example-2'
	})`
由于这三个组件共享了同一个 data，因此增加一个 counter 会影响所有组件！
可以通过为每个组件返回全新的 data 对象来解决这个问题：
	`data: function () {
	  return {
	    counter: 0
	  }
	}`

5. 构成组件：
组件意味着协同工作，通常父子组件会是这样的关系：组件 A 在它的模版中使用了组件 B。它们之间必然需要相互通信：父组件要给子组件传递数据，子组件需要将它内部发生的事情告知给父组件。然而，在一个良好定义的接口中尽可能将父子组件解耦是很重要的。这保证了每个组件可以在相对隔离的环境中书写和理解，也大幅提高了组件的可维护性和可重用性。
在 Vue.js 中，父子组件的关系可以总结为 props down, events up 。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。看看它们是怎么工作的。


二、Prop：

1. 使用prop传递数据：
组件实例的作用域是孤立的。这意味着不能在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，我们需要通过子组件的 props 选项。
子组件要显式地用 props 选项声明它期待获得的数据：
	`Vue.component('child', {
	  // 声明 props
	  props: ['message'],
	  // 就像 data 一样，prop 可以用在模板内
	  // 同样也可以在 vm 实例中像 “this.message” 这样使用
	  template: '<span>{{ message }}</span>'
	})`

2. camelCase vs kebab-case：
HTML 特性是不区分大小写的。所以，当使用的不是字符串模版，camelCased (驼峰式) 命名的 prop 需要转换为相对应的 kebab-case (短横线隔开式) 命名：
	`Vue.component('child', {
	  // camelCase in JavaScript
	  props: ['myMessage'],
	  template: '<span>{{ myMessage }}</span>'
	})
	<!-- kebab-case in HTML -->
	<child my-message="hello!"></child>`
如果使用字符串模版，则没有这些限制。

3. 动态prop：
在模板中，要动态地绑定父组件的数据到子模板的 props，与绑定到任何普通的 HTML 特性相类似，就是用 v-bind。每当父组件的数据变化时，该变化也会传导给子组件：
	`<div>
	  <input v-model="parentMsg">
	  <br>
	  <child v-bind:my-message="parentMsg"></child>
	</div>`

4. 字面量语法 vs 动态语法：
如果想传递一个实际的 number，需要使用 v-bind，从而让它的值被当作 JavaScript 表达式计算：
	`<!-- 传递实际的mumber -->
	<comp v-bind:some-prop="1"></comp>`

5. 单项数据流：
prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。
另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop 。如果你这么做了，Vue 会在控制台给出警告。
为什么我们会有修改 prop 中数据的冲动呢？通常是这两种原因：
prop 作为初始值传入后，子组件想把它当作局部数据来用；
prop 作为初始值传入，由子组件处理成其它数据输出。
对这两种原因，正确的应对方式是：
	1. 定义一个局部变量，并用 prop 的值初始化它：
	`props: ['initialCounter'],
	data: function () {
	  return { counter: this.initialCounter }
	}`
	2. 定义一个计算属性，处理 prop 的值并返回。
	`props: ['size'],
	computed: {
	  normalizedSize: function () {
	    return this.size.trim().toLowerCase()
	  }
	}`

6. prop验证：
我们可以为组件的 props 指定验证规格。如果传入的数据不符合规格，Vue 会发出警告。当组件给其他人使用时，这很有用。
要指定验证规格，需要用对象的形式，而不能用字符串数组：
	`Vue.component('example', {
	  props: {
	    // 基础类型检测 （`null` 意思是任何类型都可以）
	    propA: Number,
	    // 多种类型
	    propB: [String, Number],
	    // 必传且是字符串
	    propC: {
	      type: String,
	      required: true
	    },
	    // 数字，有默认值
	    propD: {
	      type: Number,
	      default: 100
	    },
	    // 数组／对象的默认值应当由一个工厂函数返回
	    propE: {
	      type: Object,
	      default: function () {
	        return { message: 'hello' }
	      }
	    },
	    // 自定义验证函数
	    propF: {
	      validator: function (value) {
	        return value > 10
	      }
	    }
	  }
	})`
当 prop 验证失败，Vue 会在抛出警告 (如果使用的是开发版本)。


三、自定义事件

1. 使用v-on绑定自定义事件：
每个 Vue 实例都实现了事件接口 (Events interface)，即：
使用 $on(eventName) 监听事件
使用 $emit(eventName) 触发事件
另外，父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。
不能用$on侦听子组件抛出的事件，而必须在模板里直接用v-on绑定：
	`<div id="counter-event-example">
	  <p>{{ total }}</p>
	  <button-counter v-on:increment="incrementTotal"></button-counter>
	  <button-counter v-on:increment="incrementTotal"></button-counter>
	</div>
	Vue.component('button-counter', {
	  template: '<button v-on:click="increment">{{ counter }}</button>',
	  data: function () {
	    return {
	      counter: 0
	    }
	  },
	  methods: {
	    increment: function () {
	      this.counter += 1
	      this.$emit('increment')
	    }
	  },
	})
	new Vue({
	  el: '#counter-event-example',
	  data: {
	    total: 0
	  },
	  methods: {
	    incrementTotal: function () {
	      this.total += 1
	    }
	  }
	})`
给组件绑定原生事件，想在某个组件的根元素上监听一个原生事件。可以使用.native 修饰 v-on：
	`<my-component v-on:click.native="doTheThing"></my-component>`

2. 使用自定义事件的表单输入组件
自定义事件可以用来创建自定义的表单输入组件，使用 v-model 来进行数据双向绑定。
	`<input v-model="something">`
这不过是以下示例的语法糖：
	`<input v-bind:value="something" v-on:input="something = $event.target.value">`
所以在组件中使用时，它相当于下面的简写：
	`<custom-input v-bind:value="something" v-on:input="something = arguments[0]"></custom-input>`
所以要让组件的 v-model 生效，它必须：
接受一个 value 属性
在有新的 value 时触发 input 事件
