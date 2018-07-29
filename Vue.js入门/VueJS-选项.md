---
title: VueJS-选项
date: 2017-06-05 20:34:51
tags:
---

## propsData Option ##
propsData用于在全局扩展时进行数据传递。扩展写好之后，进行挂载，这个时候可以向构造函数中传入一个对象，对象中包所一个键值对。这个键值对可以用来向扩展进行传递数据，键为propsData，值为一个对象，这个对象又是一个键值对，内部的键值对的键应当是当前扩展中的props中的某属性，值就是我们要传递的值。这样就完成了数据的传递。
	<body>
	<div id="app">
	<header></header>
	</div>
	<script>
	    var header_a = Vue.extend({
	        template: `<h2>{{message}}{{lala}}</h2>`,
	        data: function () {
	                return {
	                    message: 'hello, I am header. '
	                }
	            },
	        props: ['a', 'lala']
	    });
	    new header_a({propsData: {lala: 'gakki'}}).$mount('header');
	</script>
	</body>

## computed 选项 ##
	computed选项是用来不污染原始数据，又要对输出的数据进行操作的情形。
	<body>
	<div id="app">
	{{newMessage}}
	{{message}}
	</div>
	<script>
	    var app = new Vue({
	        el: '#app',
	        data: {
	            message: 'Gakki!'
	        },
	        computed: {
	            newMessage: function () {
	                return (this.message + 'o(^▽^)o');
	            }
	        }
	    });
	</script>
	</body>

## methods ##
在对methods进行调用的时候，函数中的参数可以在函数调用的时候进行传入。$event参数是一个包含触发事件的信息的对象。
native修饰符，调用构造器中的原始方法，而不是组件中的方法。注意是在用到的组件处，不是组件注册的地方加.native。
另外还有在作用域外部调用实例中的函数，这种方式并不好，但可以实现。对于这种情况，与之前的直接调用方法有两点区别：一是不能使用v-on:click="func()"进行绑定，而是使用onclick="func()"；二是函数名前边要加上实例的名称，这是一个成员函数。
以下是完整例子：
	<body>
	<div id="app">
	{{a}}
	    <button v-on:click="add(3)">add3</button>
	    <gakki v-on:click.native="add(7)"></gakki>
	</div>
	<button onclick="app.add(5)">add5</button>
	<script>
	    Vue.component('gakki', {
	        template: `<button>add7</button>`
	    });
	    var app = new Vue({
	        el: '#app',
	        data: {
	            a: 1
	        },
	        methods: {
	            add: function (num) {
	                console.log(num);
	                if (typeof num !== 'undefined') {
	                    this.a += num;
	                } else {
	                    this.a++;
	                }
	            }
	        }
	    });
	</script>
	</body>

## mixins ##
在已经写好了代码之后，如果临时又有新的需求，此时使用mixins会减少对原有代码的污染。另外如果是很多四方要进行公用方法的调用的时候，mixins会减少代码量。
mixins的定义的方法很简单，就是在实例中添加一个mixins选项。选项的值是一个数组，这个数组中保存着若干个mixins对象的名称。然后在外部定义一个变量，这个变量是一个直接用大括号括起来的对象。对象中可以保存想要实现的操作，比如说钩子函数等。
如果同一个事件同时出发了实例构造器中的函数与mixins中的函数，那么此时先执行mixins中的函数，再执行构造器中的函数。
mixins还可以构造全局API，就是使用Vue.mixin来进行注册。注意此时mixin中没有s。如果有全局的mixin，那么执行的顺序就要先执行全局mixin。
	<body>
	<div id="app">
	{{number}}
	    <button v-on:click="add">add</button>
	</div>
	<script>
	    Vue.mixin({
	        updated: function () {
	            console.log("我是全局API");
	        }
	    });
	    var addConsole = {
	        updated: function () {
	            console.log('数据有变化' + this.number);
	        }
	    };
	    var app = new Vue({
	        el: '#app',
	        data: {
	            number: 1
	        },
	        methods: {
	            add: function () {
	                this.number++;
	            }
	        },
	        mixins: [addConsole]
	    });
	</script>
	</body>

## extends ##
创建一个extends扩展与之前的mixins相似，也是创建一个对象。然后在构造器中进行注册，但是在构造器中不能使用数组，即不能有多个扩展，而是只能有一个扩展对象。
	<body>
	<div id="app">
	{{gakki}}
	    <button @click="add">add</button>
	</div>
	<author></author>
	<script>
	    var myExtend = {
	        updated: function () {
	            alert("我是扩展的钩子函数");
	        },
	        methods: function () {
	            alert("我是扩展的方法");
	        }
	    };
	    var app = new Vue({
	        el: "#app",
	        data: {
	            gakki: 1
	        },
	        extends: myExtend,
	        methods: {
	            gakkiFunction: function () {
	                alert("我是构造器的方法");
	            },
	            add: function () {
	                this.gakki++;
	            }
	        }
	    });
	</script>
	</body>