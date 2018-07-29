---
title: VueJS学习一个
date: 2017-03-29 15:16:07
tags:
---

一、声明式渲染：

Vue.js 的核心是一个允许采用简洁的模板语法来声明式的将数据渲染进 DOM：
说得太高深，强行解释下。上半部分是vue类型文件可以包含html，css及script。下面代码上半部分是html内容，div的id为app。而在下面script中，定义了一个vue名为app，元素名为app，数据为键值对，包括一条内容message，值为'Hello Vue!'。在html中用双大括号括起来，可以对app的message键进行解析。
并且数据双向绑定：
单向数据绑定：指的是我们先把模板写好，然后把模板和数据（数据可能来自后台）整合到一起形成 HTML 代码，然后把这段 HTML 代码插入到文档流里面。HTML 代码一旦生成完以后，就没有办法再变了，如果有新的数据来了，那就必须把之前的 HTML 代码去掉，再重新把新的数据和模板一起整合后插入到文档流中。
双向数据绑定：数据模型（Module）和视图（View）之间的双向绑定。改动会自动同步到数据模型中去，同样的，如果数据模型中的值发生了变化，也会立刻同步到视图中去。双向数据绑定的优点是无需进行和单向数据绑定的那些 CRUD 操作。
	 `<div id="app">
	  {{ message }}
	</div>
	var app = new Vue({
	  el: '#app',					//#说明绑定了id为app的元素
	  data: {
	    message: 'Hello Vue!'
	  }
	})`
看起来这跟单单渲染一个字符串模板非常类似，但是 Vue 在背后做了大量工作。现在数据和 DOM 已经被绑定在一起，一切都是响应式的。
除了文本插值，还可以采用 v-bind:属性=键 的方式绑定 DOM 元素属性：
同样的，把app-2元素绑定在div的id上，利用v-bind:title="message"语句，将span元素的title属性绑定为data的message。
    `<div id="app-2">
	  <span v-bind:title="message">
	    鼠标悬停几秒钟查看此处动态绑定的提示信息！
	  </span>
	</div>
	var app2 = new Vue({
	  el: '#app-2',
	  data: {
	    message: '页面加载于 ' + new Date()
	  }
	})`
v-bind 属性被称为指令。指令带有前缀 v-，以表示它们是 Vue 提供的特殊属性。指令会在渲染的 DOM 上应用特殊的响应式行为。简言之，这里该指令的作用是：“将这个元素节点的 title 属性和 Vue 实例的 message 属性保持一致”。


二、条件与循环：

这里，seen的值为布尔值true，p元素上的指令为v-if="seen"，为条件指令，表示如果为true时则显示文本。这个例子演示了不仅可以绑定 DOM 文本到数据，也可以绑定 DOM 结构到数据。而且，Vue 也提供一个强大的过渡效果系统，可以在 Vue 插入 / 更新 / 删除元素时自动应用过渡效果。
    `<div id="app-3">
	  <p v-if="seen">现在你看到我了</p>
	</div>
	var app3 = new Vue({
	  el: '#app-3',
	  data: {
	    seen: true
	  }
	})`

v-for 指令可以绑定数组的数据来渲染一个项目列表：
	`<div id="app-4">
	  <ol>
	    <li v-for="todo in todos">
	      {{ todo.text }}
	    </li>
	  </ol>
	</div>
	var app4 = new Vue({
	  el: '#app-4',
	  data: {
	    todos: [
	      { text: '学习 JavaScript' },
	      { text: '学习 Vue' },
	      { text: '整个牛项目' }
	    ]
	  }
	})`
例子中的data有一条数据为todos，他的值为一个数组，数组中每个元素都是一个对象，他们键值对中的值为文本类型。利用v-for="todo in todos"语句，会依次遍历每一个todos的对象。然后解析出对象的文本值。


三、处理用户输入：

下面这个例子中的app5不仅有data项，而且还有methods行为。其中定义了一个名叫reverseMessage的行为，他的作用是把调用元素的message设置为新的值，这个值为先用空格将message分开，然后在颠倒顺序最后再用空格合并的字符串。而在html中的指令，用 v-on 指令绑定一个调用 Vue 实例方法的事件监听器，则规定当按钮被点击时，执行reverseMessage行为。
    `<div id="app-5">
	  <p>{{ message }}</p>
	  <button v-on:click="reverseMessage">逆转消息</button>
	</div>
	var app5 = new Vue({
	  el: '#app-5',
	  data: {
	    message: 'Hello Vue.js!'
	  },
	  methods: {
	    reverseMessage: function () {
	      this.message = this.message.split('').reverse().join('')
	    }
	  }
	})`
注意在 reverseMessage 方法中，我们更新了应用的状态，但没有触碰 DOM，所有的 DOM 操作都由 Vue 来处理，你编写的代码只需要关注底层逻辑。

Vue 还提供了 v-model 指令，使表单输入和应用状态间的双向绑定变得轻而易举。v-model 这个指令只能用在 <input> ,  <select> , <textarea>这些表单元素上，所谓双向绑定，指的就是我们在js中的vue实例中的data与其渲染的dom元素上的内容保持一致，两者无论谁被改变，另一方也会相应的更新为相同的数据。这是通过设置属性访问器实现的。
    `<div id="app-6">
	  <p>{{ message }}</p>
	  <input v-model="message">
	</div>
	var app6 = new Vue({
	  el: '#app-6',
	  data: {
	    message: 'Hello Vue!'
	  }
	})`


四、组件化应用构建：

组件（Component）是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素， Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 js 特性扩展。
在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例，在 Vue 中注册组件很简单：
    `// 定义名为 todo-item 的新组件
	Vue.component('todo-item', {
	  template: '<li>这是个待办项</li>'
	})`
可以用它构建另一个组件模板：
    `<ol>
	  <!-- 创建一个 todo-item 组件的实例 -->
	  <todo-item></todo-item>
	</ol>`
也就是说，我们需要先在Vue中注册一个组件，Vue.component(tagName, options))来进行注册，传入两个值，第一个字符串是组件的名称，第二个参数是对象，类似于组件的解释或者组件的值。
组件能将数据从父作用域传到子组件。可以修改组件的定义，使之能够接受一个属性：
	`Vue.component('todo-item', {
	  // todo-item 组件现在接受一个
	  // "prop"，类似于一个自定义属性
	  // 这个属性名为 todo。
	  props: ['todo'],
	  template: '<li>{{ todo.text }}</li>'
	})`
上边的例子就可以渲染不同的文本。例如：
	`<div id="app-7">
	  <ol>
	    <!-- 现在我们为每个todo-item提供待办项对象    -->
	    <!-- 待办项对象是变量，即其内容可以是动态的 -->
	    <todo-item v-for="item in groceryList" v-bind:todo="item"></todo-item>
	  </ol>
	</div>
	Vue.component('todo-item', {
	  props: ['todo'],
	  template: '<li>{{ todo.text }}</li>'
	})
	var app7 = new Vue({
	  el: '#app-7',
	  data: {
	    groceryList: [
	      { text: '蔬菜' },
	      { text: '奶酪' },
	      { text: '随便其他什么人吃的东西' }
	    ]
	  }
	})`
首先注册了一个组件，他可以渲染为li元素，其中的文本是todo的text值，并且元素有一个属性数组，数组中有一个todo属性。将app-7以id绑定，他的data中有groceryList数据，这个数据是一个列表，列表的元素是以对象构成，对象中有text键。现在使用了组件，并且在组建内通过v-for来遍历每一个groceryList中的对象元素，通过v-bind将todo属性绑定为item（遍历的每个元素）。