---
title: Vue-全局API
date: 2017-06-05 15:31:34
tags:
---

全局API是在构造器之外，先声明全局变量或者直接在Vue上定义的新功能。即在构造器外部用Vue提供的API函数来进行定义新的功能。

## 自定义指令 Vue.directive ##
在实例中，有数据number与color，初值分别为1余blue。然后还有一个add方法，可以对number进行自增。然后再模板中将按钮点击事件绑定这个add方法。同时，我们在定义实例之前使用Vue.directive方法自定义了一个指令，叫lyx。这个函数的作用是将DOM元素中的style属性进行设置。这里我们不用写字母v作为前缀，但是使用的时候应当加上v字母前缀。el就是当前的DOM元素。另外一个参数是binding，他是一个包含指令信息的对象。
代码如下：
	<body>
	<div id="app">
	{{number}}
	    <button v-on:click="add">ADD</button>
	    <div v-lyx="color">{{number}}</div>
	</div>
	
	<script>
	    Vue.directive('lyx', function (el, binding) {
	        console.log(el);
	        console.log(binding);
	        console.log(binding.name);
	        console.log(binding.value);
	        console.log(binding.expression);
	        el.style = 'color: ' + binding.value;
	    });
	    var app = new Vue({
	        el: '#app',
	        data: {
	            number: 1,
	            color: 'blue'
	        },
	        methods: {
	            add: function () {
	                return this.number++
	            }
	        }
	    });
	</script>
	</body>
另外，directive自定义指令有五个钩子函数：
1. bind：只调用一次，当指令第一次绑定到元素上的时候触发。一般用于进行初始化操作
2. inserted：当被绑定元素插入父节点时调用，此时父节点不必在document中。
3. updated：被绑定的元素节点所在的模板进行更新的时候进行调用。如果绑定的值发生了变化，此时触发。
4. componentUpdated：当被绑定的元素节点所在的模板完成一次更新的时候进行调用。
5. unbind：只调用一次，当指令与元素解除绑定的时候触发。

## Vue.extend构造器的延伸 ##
Vue.extend返回一个扩展实例构造器，也就是预设了一些选项的Vue实例构造器，常用于生成组件，可以理解为在模板中遇到以该该组件名作为标签的组件时，会自动调用扩展实例构造器生成组件实例并挂载到自定义元素上。他是在构造器的外边扩展构造器。
先在要新定义一个组件，构造器中传入一个对象。对象中可以有多个选项。比如说template模板，接受一个字符串。它是用单引号将html元素包含起来。data不能像构造器中那样，直接写数据。而是要写一个匿名方法，通过return来返回数据。
最后所有的扩展器都需要进行加载，即用new来进行加载，然后传入类似于jquery选择器mount函数进行绑定。
	<body>
	<div id="app">
	
	</div>
	<author></author>
	<script>
	    var authorUrl = Vue.extend({
	        template: '<p><a v-bind:href="authorUrl">{{authorName}}</a></p>',
	        data: function () {
	            return {
	                authorName: 'liyanxiang',
	                authorUrl: 'http://jspang.com'
	            }
	        }
	    });
	    new authorUrl().$mount('author');
	
	</script>
	</body>

## Vue.set ##
Vue.set的作用是在实例构造器外部来操作构造器内部的数据、属性或者方法。
1. 引用构造器外部数据
外部数据即不实在Vue构造器内部声明，而是在外部声明数据。并在构造器内部的data处进行引用。
2. 三种方法改变数据。
包括Vue.set方法，app.count与outData.count直接操作数据。但是后两种操作收到js的限制，在通过下标改变数组元素或者改变数组的长度的时候，是不能进行对数据的更新的，此时用Vue.set方法比较好。
	<body>
	<div id="app">
	    {{count}}
	</div>
	<button onclick="add()">click</button>
	<script>
	    function add() {
	        Vue.set(outData, 'count', 2);
	        app.count++;
	        outData.count++;
	    }
	    var outData = {
	        count: 1,
	        goods: 'hahaha'
	    };
	    var app = new Vue({
	        el: '#app',
	        data: outData
	    });
	</script>
	</body>

## Vue 生命周期 ##
Vue有10个生命周期，相对应10个钩子函数。
[https://segmentfault.com/a/1190000008010666](https://segmentfault.com/a/1190000008010666)

## template 模板 ##
此处先介绍三种模板的构建方法
1. 构造器中创建模板
在构造器中添加template选项，然后用`符号将要构成模板的html包裹起来
2. template标签添加模板
在body中的template标签中，添加模板需要的html，并且设置template的id。之后再script的构造器中添加一个template选项，类似于jquery选择器中，把template中的id字符串传进去即可。
3. script标签模板
单独新建一个script标签，利用script来创建模板。script的type必须是x-template，并且必须设置id，这个id就是之后模板的id。
	<body>
	<div id="app">
	</div>
	<template id="biaoqian">
	    <h2 style="color: blue">我是template标签模板</h2>
	</template>
	<script type="x-template" id="script">
	    <h2 style="color: green">我是script标签模板</h2>
	</script>
	<script>
	    Vue.component('lyx', {
	        template: `<h2>我是全局组件</h2>`
	    });
	    var app = new Vue({
	        el: '#app',
	        components: {
	            'jubu': {
	            template: `<h2>我是局部组件</h2>`
	            }
	        },
	        //template: "#biaoqian",
	        //template: `<h2 style="color: red">我是选项模板</h2>`,
	        template: "#script"
	    });
	</script>
	</body>

## componet组件 ##
1. 全局注册组件
在构造器外部通过Vue.component进行注册。函数内部传入两个参数，第一个参数为字符串，是组件的表签名。第二个参数是一个对象，对象中有一个template选项，用来表示组件的模板。模板像之前一样可以使用`号来对html元素进行包裹。全局组件的意思是，不必局限于某一个vue实例，但是必须是在vue实例app中使用。这样就完成了全局组件的注册，在app中可以通过表签名使用组件。
2. 局部注册组件
在构造器内部注册组件，就是在实例中添加一个components选项(注意有s，为复数)，选项就收一个对象。对象中可以注册多个组件，每个组件都是一个键值对，其中键为一个字符串，是组件的名字。值又是一个对象，这个对象中又需要键值对。这个键值对也与之前全局组件类似，键是template，值是`符号包裹的html。
	<body>
	<div id="app">
	    <lyx></lyx>
	    <gakki></gakki>
	    <yui></yui>
	</div>
	<script>
	    Vue.component("lyx", {
	        template: `<h2 style="color: dodgerblue">你好，LYX</h2>`
	    });
	    var app = new Vue({
	        el: "#app",
	        components: {
	            'gakki': {
	                template: `<h2 style="color: orange">你好， GAKKI</h2>`
	            },
	            'yui': {
	                template: `<p>今天非常高兴</p>`
	            }
	        }
	    });
	</script>
	</body>

## 组件 props 属性 ##
在组件中定义属性需要用到props选项，就是在对应注册组件的对象中添加props选项，props选项是一个数组，在组件中读出属性的值只需要使用插值的形式。另外注意属性中不能有短斜线，需要转换成小驼峰命名写法。
	<body>
	<div id="app">
	<panda wife="结衣酱" hometown="琉球群岛" v-bind:color="bnw"></panda>
	</div>
	<script>
	    var app = new Vue({
	        el: '#app',
	        data: {
	            bnw: 'blue'
	        },
	        components: {
	            'panda': {
	                template: `<p>我老婆是{{wife}}，祖籍{{hometown}}，喜欢的颜色是{{color}}</p>`,
	                props: ['wife', 'hometown', 'color']
	            }
	        }
	    });
	</script>
	</body>

## component 父子组件关系 ##
1. 在构造器外部注册局部组件
组件代码量很大等情况，建议将局部组建在外部注册。与在构造器中注册组件类似，也是需要在构造器内部的components中进行注册，然后将template的值由之前用`来包裹的html，改写为一个变量。这个变量在外部是一个template模板。
2. 在父组件中注册子组件
同以上内容一样，components中的值不必再写为一个对象，可以改写为一个变量。在外部可以对整个组件来注册。
另外一点就是，子组件要写在父组件之前。因为是从上到下进行加载。
	<body>
	<div id="app">
	<panda></panda>
	</div>
	    <script>
	        var gakki = {
	            template: `<h2 style="color: green">这是外部构造器组件的子组件</h2>`
	        };
	        var panda = {
	            template: `<div><h2 style="color: blue">这是外部构造器组件的父组件</h2>
	                        <gakki></gakki></div>`,
	            components: {
	                'gakki': gakki
	            }
	        };
	        var app = new Vue({
	            el: '#app',
	            data: {
	
	            },
	            components: {
	                'cat': {
	                    template: `<h2></h2>`
	                },
	                "panda": panda
	            }
	        });
	    </script>
	</body>

## component 标签 ##
component标签是vue定义的一种标签，他可以动态绑定组件。从而可以对标签进行切换等操作。
	<body>
	<div id="app">
	<component v-bind:is="who"></component>
	    <button v-on:click="changeComponent">change</button>
	</div>
	<script>
	    var componentA = {
	        template: `<h2 style="color: chocolate">组件A</h2>`
	    };
	    var componentB = {
	        template: `<h2 style="color: darkkhaki">组件B</h2>`
	    };
	    var componentC = {
	        template: `<h2 style="color: darkcyan">组件C</h2>`
	    };
	    var app = new Vue({
	        el: '#app',
	        data: {
	            who: 'componentA'
	        },
	        components: {
	            'componentA': componentA,
	            'componentB': componentB,
	            'componentC': componentC
	        },
	        methods: {
	            changeComponent: function () {
	                if (this.who === 'componentA') {
	                    this.who = 'componentB'
	                } else if (this.who === 'componentB') {
	                    this.who = 'componentC'
	                } else if (this.who === 'componentC') {
	                    this.who = 'componentA'
	                }
	            }
	        }
	    });
	</script>
	</body>