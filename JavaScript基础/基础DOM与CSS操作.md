---
title: 基础DOM与CSS操作
date: 2017-03-16 17:50:42
tags:
---

DOM中，D表示页面文档document；O表示对象object，即一组含有独立特性的数据集合；M表示模型module，及页面上的元素节点与文本节点等。

一、DOM方法

1. html():
此方法就是将要获得的html“显示”出来，获取的内容将带有html标签：
    `$(function () {
    alert($("#box").html());
	});`

2. text():
此方法就是将要获得的元素中的文本元素取出来，获取的内容将自动去除html标签：
	`$(function () {
    alert($("#box").text());
	});`

3. 不管是html()还是text()函数都可以有一个value参数，用以设置、替换html内容。对于text方法则是替换文本内容。html方法会自动解析，text方法会自动转译：
	`$(function () {
    $("#box").html("<em>hello</em>");
	});`

4. val()：
此方法可以对表单元素进行获取或者设置内部的值。它所操作或者获取的是input元素的value属性。
    `$(function () {
    alert($("#text").val());
	});`
	`$(function () {
    $("#text").val("liyanxiang");
	});`

5. attr():
attr()方法专门用来操作某一元素的属性。他可以接受一个参数key来获得对应属性的value：
	`$(function () {
    alert($("#text").attr("value"));
	});`
也可以接收两个参数key与value来对属性进行设置：
	`$(function () {
    $("#text").attr("title", "中午吃什么?");
	});`
也可以接受多个属性值进行设置，就像json的格式：
    `$(function () {
    $("#text").attr({
        "title": "中午吃什么",
        "value": "麻辣香锅",
        "class": "lunch"
    });
	});`

6. 以上方法还可以接受返回字符串的方法。比如说attr()方法中，function可以传入0到2个值：
	`$(function () {
    $("#text").attr("id", function (value, index) {
        return "newId" + value + index;
    });
	});`

7. removeAttr():
删除属性，不能接受function函数作为参数：
    `$(function () {
    $("#text").removeAttr("id");
	});`

二、元素样式CSS的操作：

1. css():
此方法可以传入一个或者两个参数，用以获得或者设置CSS的样式。如果获取不存在的样式，会返回默认设置颜色。还可以获取多个CSS样式，可以利用[]将想要获得的样式传递，获得一个原生数组对象：
	`$(function () {
    alert($("#text").css(["color", "width", "height"]));
	});`
用each()方法遍历原生态数组：
	`$(function () {
    var css = $("div").css(["color", "width", "height"]);
    $.each(css, function (attr, value) {
        alert(attr + ":" + value);
    })
	});`
利用each()方法也可以操作jquery数组对象。
css()方法可以批量设置样式，可以使用连缀css()方法，或者就像在CSS获得json一样的格式：
	`$(function () {
    $("div").css({
        "color": "blue",
        "background-color": "#eee",
        "width": "200px",
        "height": "100px"
    });
	});`
css()方法还可以接收函数作为参数，这样可以将一些参数变为匿名函数内部的局部变量。此函数返回要设置的属性值。接受两个参数，index为元素在对象集合中的索引位置，value是原先的属性值。：
    `$(function () {
    $("div").css("height", function (index, value) {
        return parseInt(value) + 500 + "px";
    });
	});`

2. toggleClass():
该方法检查每个元素中指定的类。如果不存在则添加类，如果已设置则删除之。这就是所谓的切换效果。
此函数可以进行默认样式与指定样式类之间的切换，以空格分开可以设置多个类。：
	`$(function () {
    $("div").click(function () {
        $(this).toggleClass("red size");
    });
	});`
此函数另外可以接受一个布尔型的参数来规定是否添加(true)或移除(false)类。
toggleClass方法可以传入一个方法，来进行类的切换：
	`$(function () {
    $("div").click(function () {
        $(this).toggleClass(function () {
            if ($(this).hasClass("red")) {
                $(this).removeClass("red");
                return "green";
            } else {
                $(this).removeClass("green");
                return "red";
            }
        });
    });
	});`

可以直接调用方法来获得或者设置样式参数：
例如width();返回的是数值，设置传入可以是数值也可以是字符串。也可以像之前的方法一样接收一个匿名参数。
	`$(function () {
    $("div").width(function (index, width) {
        return width - 500 + "px";
    })
	});`
当然函数中的“px”也可以省略。

innerWidth()			包含内边距padding
outerWidth()			包含边框border和内边距padding
outerWidth(true)		包含外边距、边框与内边距

元素偏移方法：
offset()				返回对象，表示一个点。元素相对于视口的偏移位置
position()				元素相对与父元素的偏移位置
scrollTop()				滚动条的位置，可以传入位置数值
