---
title: JQuery基础
date: 2017-03-12 09:35:43
tags:
---
一、在jquery中，不管是页面元素的选择还是内置的功能函数，都应该使用美元符号“$”来起始的。“$”是jquery中的特有对象——jquery对象。也就是说，$ === JQuery。
    $(function () {});					//执行一个匿名函数
	$("#box");							//执行id元素选择
	$("#box").css("color", "red");		//执行功能函数
jquery中，注释与js中是一样的。

二、对于加载，原生js与jquery则有不同：
1. js中onload方法是等待包括图片等资源全部加载完毕之后，再执行包裹代码。
2. 并且代码只能执行一次，多次调用的时候，之前执行的代码就会被覆盖。

1. 而jquery中使用ready方法只需要等待body中的结构加载完毕，就可以执行包裹代码。
2. 代码可以执行多次，不会被覆盖。
3. 有简写方法，匿名函数就是延迟加载。`$(function () {});`

三、互换对象：
在jquery中使用包裹后，返回的都是jquery对象。而想要获得js的DOM对象，利用jquery对象的get()方法获得。当然也可以用DOM对象获得jquery对象，只需要利用“$”符号包裹：
    $(function () {
    	alert($("#box").get(0));
    	alert($(document.getElementById("box")));
	});

四、库之间的冲突：
假设有另一个库base，也使用“$”进行包裹。那么两个库之间的语句就可能出现冲突，如果jquery库在base库之前引用，那么“$”所有权就是base库的。有两种解决方法：
1. 使用“jquery”来代替“$”，或者利用其他符号代替：
    var $$ = JQuery;
2. `JQuery.noConflict();			//去除“$”符号所有权`		