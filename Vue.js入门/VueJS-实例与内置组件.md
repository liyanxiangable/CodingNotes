---
title: VueJS-实例与内置组件
date: 2017-06-06 23:16:17
tags:
---

## vue自定义事件 ##
vue可以使用$on来自定义事件。如下可以在vue实例之外来触发vue实例的事件，首先用$on来监听自定义事件，然后对于在vue实例之外的点击，监听这个原生的点击事件，使用$emit触发刚才自定义的事件。事件执行的函数就随意了，可以想代码中展示的app.reduce()，也可以this.number--。
另外还有一个只执行一次的$once事件，他会在普通时间之前发生。
最后还有一个$off关闭事件，可以对普通的事件进行关闭。
	<body>
	<div id="app">
	    {{number}}
	    <button @click="add">add</button>
	</div>
	<button onclick="reduce()">reduce</button>
	<script>
	    var app = new Vue({
	        el: "#app",
	        data: {
	            number: 1
	        },
	        methods: {
	            add: function () {
	                this.number++;
	            },
	            reduce: function () {
	                this.number--;
	            }
	        }
	    });
	    app.$on('reduce', function () {
	        console.log("执行了自定义方法。");
	        app.reduce();
	    });
	    app.$once('gakki', function () {
	        alert("我只出现一次呀.");
	    });
	    function reduce() {
	        //app.number--;
	        app.$emit('reduce');
	        app.$emit('gakki');
	        app.$off('reduce');
	    }
	</script>
	</body>

## slot ##
slot用于对组件或者模板进行数据的分发。slot是插槽的意思，就是可以把模板看作为一个外设，然后要渲染的代码中要写清楚插槽的接口，如果对得上，那么就可以成功的将外设插在主机上。
slot使用分两步：
1. 在实际要渲染的代码中进行数据的索取。
1. 在模板中，使用span来对数据进行索取，而在模板的slot标签