---
title: LeetCode-习题笔记16-SingleNumber
date: 2017-08-15 11:29:39
tags:
---


Given an array of integers, every element appears twice except for one. Find that single one.

Note:
Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

给出一个整数数组，其中除了一个元素之外，每一个元素都出现两次。找出这个元素。
注意你的算法应当只有线性的复杂度。

首先我对复杂度有个疑问，这里说只有线性的复杂度，那么我调用标准库自带的排序方法这是算O(1)的复杂度还是O(n^2)？
我想可以进行排序，然后进行遍历比较大小。
	/**
	 * @param {number[]} nums
	 * @return {number}
	 */
	var singleNumber = function(nums) {
	    // 数组进行排序
	    nums.sort(function (a, b) { return a - b });
	    // 遍历数组，由于要进行比较，所以到nums - 1为止
	    for (let i = 0; i < nums.length - 1; i += 2) {
	        // 对于已经排序好并且除了一个数之外都是成对出现的数组，
	        // 那个只出现一次的数，打乱比较的结果
	        // 比较结果又两种，一是singleNum不在最开始（singleNum排序最小）
	        // 一是singleNum在排序后数组的最前面
	        // 这两种无论是哪一种，都会使两个两个的比较出现不相等
	        if (nums[i] !== nums[i + 1]) {
	            return nums[i];
	        }
	    }
	    // 如果没有出现不相等的情况，那么就是最后一个数
	    return nums[nums.length - 1];
	};

另外捡到有人使用位运算，看起来挺好的。





参考链接：

1. [https://leetcode.com/problems/single-number/description/](https://leetcode.com/problems/single-number/description/)
2. [https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array](https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array)
3. [https://discuss.leetcode.com/topic/1916/my-o-n-solution-using-xor](https://discuss.leetcode.com/topic/1916/my-o-n-solution-using-xor)
4. [https://discuss.leetcode.com/topic/22068/easy-java-solution-tell-you-why-using-bitwise-xor](https://discuss.leetcode.com/topic/22068/easy-java-solution-tell-you-why-using-bitwise-xor)