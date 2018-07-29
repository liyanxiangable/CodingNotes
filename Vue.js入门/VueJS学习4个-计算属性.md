---
title: VueJS学习四个-计算属性
date: 2017-03-29 21:35:16
tags:
---

在模板中放入太多的逻辑会让模板过重且难以维护。这就是对于任何复杂逻辑，都应当使用计算属性的原因。

已经以声明的方式创建了依赖关系：计算属性的 getter 是没有副作用。
比如说：
	`<div id="example">
	  <p>Original message: "{{ message }}"</p>
	  <p>Computed reversed message: "{{ reversedMessage }}"</p>
	</div>
	var vm = new Vue({
	  el: '#example',
	  data: {
	    message: 'Hello'
	  },
	  computed: {
	    // a computed getter
	    reversedMessage: function () {
	      // `this` points to the vm instance
	      return this.message.split('').reverse().join('')
	    }
	  }
	})`

计算缓存 vs Methods：
可以通过调用表达式中的 method 来达到同样的效果：
	`<p>Reversed message: "{{ reversedMessage() }}"</p>
	// in component
	methods: {
	  reversedMessage: function () {
	    return this.message.split('').reverse().join('')
	  }
	}`
我们可以将同一函数定义为一个 method 而不是一个计算属性。对于最终的结果，两种方式确实是相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。
这也同样意味着下面的计算属性将不再更新，因为 Date.now() 不是响应式依赖：
	`	computed: {
	  now: function () {
	    return Date.now()
	  }
	}`
相比而言，只要发生重新渲染，method 调用总会执行该函数。
如果不希望有缓存，请用 method 替代。

Computed 属性 vs Watched 属性：
Vue 确实提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：watch 属性。当你有一些数据需要随着其它数据变动而变动时，你很容易滥用 watch——特别是如果你之前使用过 AngularJS。然而，通常更好的想法是使用 computed 属性而不是命令式的 watch 回调。
这里不太懂，回头再来看。

计算 setter：
计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter ：
	`// ...
	computed: {
	  fullName: {
	    // getter
	    get: function () {
	      return this.firstName + ' ' + this.lastName
	    },
	    // setter
	    set: function (newValue) {
	      var names = newValue.split(' ')
	      this.firstName = names[0]
	      this.lastName = names[names.length - 1]
	    }
	  }
	}
	// ...`
现在在运行 vm.fullName = 'John Doe' 时， setter 会被调用， vm.firstName 和 vm.lastName 也相应地会被更新。

观察 Watchers：
虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的 watcher 。这是为什么 Vue 提供一个更通用的方法通过 watch 选项来响应数据的变化。当想要在数据变化响应时，执行异步操作或开销较大的操作，这是很有用的。
	`<div id="watch-example">
	  <p>
	    Ask a yes/no question:
	    <input v-model="question">
	  </p>
	  <p>{{ answer }}</p>
	</div>
	<!-- Since there is already a rich ecosystem of ajax libraries    -->
	<!-- and collections of general-purpose utility methods, Vue core -->
	<!-- is able to remain small by not reinventing them. This also   -->
	<!-- gives you the freedom to just use what you're familiar with. -->
	<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
	<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
	<script>
	var watchExampleVM = new Vue({
	  el: '#watch-example',
	  data: {
	    question: '',
	    answer: 'I cannot give you an answer until you ask a question!'
	  },
	  watch: {
	    // 如果 question 发生改变，这个函数就会运行
	    question: function (newQuestion) {
	      this.answer = 'Waiting for you to stop typing...'
	      this.getAnswer()
	    }
	  },
	  methods: {
	    // _.debounce 是一个通过 lodash 限制操作频率的函数。
	    // 在这个例子中，我们希望限制访问yesno.wtf/api的频率
	    // ajax请求直到用户输入完毕才会发出
	    // 学习更多关于 _.debounce function (and its cousin
	    // _.throttle), 参考: https://lodash.com/docs#debounce
	    getAnswer: _.debounce(
	      function () {
	        var vm = this
	        if (this.question.indexOf('?') === -1) {
	          vm.answer = 'Questions usually contain a question mark. ;-)'
	          return
	        }
	        vm.answer = 'Thinking...'
	        axios.get('https://yesno.wtf/api')
	          .then(function (response) {
	            vm.answer = _.capitalize(response.data.answer)
	          })
	          .catch(function (error) {
	            vm.answer = 'Error! Could not reach the API. ' + error
	          })
	      },
	      // 这是我们为用户停止输入等待的毫秒数
	      500
	    )
	  }
	})
	</script>`
在这个示例中，使用 watch 选项允许行异步操作（访问一个 API），限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这是计算属性无法做到的。
