---
title: LeetCode-习题笔记68-PowerOfThree
date: 2017-08-25 11:54:32
tags:
---


Given an integer, write a function to determine if it is a power of three.

Follow up:
Could you do it without using any loop / recursion?


	var isPowerOfThree = function(n) {
	    if (n <= 0) return false;
	    let temp = Math.log10(n) / Math.log10(3);
	    return temp === Math.floor(temp)
	};





参考链接：

1. [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/log](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/log)