---
title: LeetCode-习题笔记87-PowerOfFour
date: 2017-08-28 19:18:26
tags:
---


Given an integer (signed 32 bits), write a function to check whether it is a power of 4.

Example:
Given num = 16, return true. Given num = 5, return false.

Follow up: Could you solve it without loops/recursion?


参考链接中的方法很巧妙。需要注意的是，虽然只有一行代码，但是这里涉及到位运算、逻辑运算与大小比较，所以运算优先级很可能混淆，一定不要吝啬加括号。并且js是弱类型的语言，他的返回值不会经过隐式的转换，这行代码用C语言写的话就有所不同，不需要进行比较相等。但是js中还是要比较，或者是进行显式的类型转换。

	var isPowerOfFour = function(num) {
	    return (num > 0) && ((num & (num - 1)) === 0) && ((num & 0x55555555) === num);
	};



参考链接:

1. [https://discuss.leetcode.com/topic/42855/o-1-one-line-solution-without-loops](https://discuss.leetcode.com/topic/42855/o-1-one-line-solution-without-loops)