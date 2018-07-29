---
title: LeetCode-习题笔记9-ReverseString
date: 2017-08-13 20:54:33
tags:
---



Write a function that takes a string as input and returns the string reversed.

Example:
Given s = "hello", return "olleh".

写一个可以输出反转后的输入字符串的函数。
这个太简单了。

	/**
	 * @param {string} s
	 * @return {string}
	 */
	var reverseString = function(s) {
	    return s.split('').reverse().join('');
	};