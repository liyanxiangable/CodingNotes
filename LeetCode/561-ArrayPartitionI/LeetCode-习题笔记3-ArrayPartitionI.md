---
title: LeetCode-习题笔记3-ArrayPartitionI
date: 2017-07-28 10:24:36
tags:
---

Given an array of 2n integers, your task is to group these integers into n pairs of integer, say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.
Example 1:
Input: [1,4,3,2]
Output: 4
Explanation: n is 2, and the maximum sum of pairs is 4 = min(1, 2) + min(3, 4).
Note:
n is a positive integer, which is in the range of [1, 10000].
All the integers in the array will be in the range of [-10000, 10000].

给你一个2n个元素的整数数组，你的任务是把这些整数合并成n对。将他们命名为(a1, b1), (a2, b2), ..., (an, bn)，使得在将i从1到n的min(ai, bi)表达式的和尽可能的大。
例如：输入数组[1,4,3,2]，则输出4。
讲解：输入数组中n为2，那么最大的各个整数对的和是4 = min(1, 2) + min(3, 4)。
提示：n是一个正整数，范围为[1, 10000]，数组中整数的范围为[-10000, 10000]。


我的想法就是如果想要总和最大，那么应当使得每一个整数对表达式尽可能大，而整数对又是取得两个数的最小值，所以我想的是应当使整数对中的两个数尽量相近，甚至相等。所以我想应该先对数组进行排序，然后再进行两个两个的按顺序进行分组并求和，最后得到结果。直接对数组进行排序之后，选每组整数对的前一个数（升序排序）。
	/**
	 * @param {number[]} nums
	 * @return {number}
	 */
	var arrayPairSum = function(nums) {
	    nums.sort();
	    var sum = 0;
	    for (var i = 0; i < nums.length; i += 2) {
	        sum += nums[i];
	    }
	    return sum;
	};
但是这么写不对，为什么呢？js排序中，不是按照我们直观的数值大小排序来进行的。
举个栗子：
![](http://i.imgur.com/ZoLzJDm.png)
他默认按照字符串的unicode码点进行排序，所以当想要进行数值的比较的时候，需要向sort中传入一个比较函数。
所以传入如下函数：
    nums.sort(function (a, b) {
        return a >= b ? 1 : -1;
    });
比较ab两个数，如果在数值上a>=b的话，函数返回1，否则返回-1（其实只要区分正负值即可，不用限定具体的数值）。现在比较大小，如果a大于b，返回正值，那么a就会排到b后边，从而形成升序。降序反之：
![](http://i.imgur.com/kVzKC7B.png)
所以最终答案：
	/**
	 * @param {number[]} nums
	 * @return {number}
	 */
	var arrayPairSum = function(nums) {
	    nums.sort(function (a, b) {
	        return a >= b ? 1 : -1;
	    });
	    var sum = 0;
	    for (var i = 0; i < nums.length; i += 2) {
	        sum += nums[i];
	    }
	    return sum;
	};





参考链接：

1. [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort "sort()方法")
2. 