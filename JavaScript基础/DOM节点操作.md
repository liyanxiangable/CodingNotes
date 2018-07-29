---
title: DOM节点操作
date: 2017-03-16 20:48:53
tags:
---

创建并插入结点：
    `$(function () {
    var box = $("<div>你好</div>")
    $("div").append(box);
	});`

一、内部插入：
内部最后
append()
    `$(selector).append(content)`
appendTo()
	`$(content).appendTo(selector)`
内部最前
prepend()
prependTo()

二、外部插入：
同级前边
after()
	`$(selector).after(content)`
同级后边
before()
同级前后
insertAfter()
insertBefore()
	`$(content).insertBefore(selector)`

包裹：

wrap():
	`$(selector).wrap(wrapper)`
其中，wrapper是必需的。规定包裹被选元素的内容。
可能的值:
HTML 代码 - 比如 ("<div></div>")
新元素 - 比如 (document.createElement("div"))
已存在的元素 - 比如 ($(".div1"))
已存在的元素不会被移动，只会被复制，并包裹被选元素。

unwrap():
此方法删除被选元素的父元素。
	`$(selector).unwrap()`

wrapAll():
在指定的 HTML 内容或元素中放置所有被选的元素。
	`$(selector).wrapAll(wrapper)`

wrapInner():
方法使用指定的 HTML 内容或元素，来包裹每个被选元素中的所有内容 (inner HTML)。
    `$(selector).wrapInner(wrapper)`

节点操作：

clone():
方法生成被选元素的副本，包含子节点、文本和属性。
    `$(selector).clone(includeEvents)`
includeEvents可选。布尔值。规定是否复制元素的所有事件处理。默认副本中不包含事件处理器。

remove():
方法移除被选元素，包括所有文本和子节点。
该方法不会把匹配的元素从 jQuery 对象中删除，因而可以在将来再使用这些匹配的元素。返回被删除的对象。
但除了这个元素本身得以保留之外，remove() 不会保留元素的 jQuery 数据。其他的比如绑定的事件、附加的数据等都会被移除。这一点与 detach() 不同。
	`$(selector).remove()`

detach():
方法移除被选元素，包括所有文本和子节点。
这个方法会保留 jQuery 对象中的匹配的元素，因而可以在将来再使用这些匹配的元素。
detach() 会保留所有绑定的事件、附加的数据，这一点与 remove() 不同。
	`$(selector).detach()`

empty():
方法从被选元素移除所有内容，包括所有文本和子节点。
    `$(selector).empty()`

replaceWith()：
方法用指定的 HTML 内容或元素替换被选元素。
replaceWith() 与 replaceAll() 作用相同。差异在于语法：内容和选择器的位置，以及 replaceAll() 无法使用函数进行替换。
    `$(selector).replaceWith(content)`