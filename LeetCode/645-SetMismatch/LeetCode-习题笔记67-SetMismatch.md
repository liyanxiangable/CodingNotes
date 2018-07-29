---
title: LeetCode-习题笔记67-SetMismatch
date: 2017-08-25 11:12:59
tags:
---


The set S originally contains numbers from 1 to n. But unfortunately, due to the data error, one of the numbers in the set got duplicated to another number in the set, which results in repetition of one number and loss of another number.

Given an array nums representing the data status of this set after the error. Your task is to firstly find the number occurs twice and then find the number that is missing. Return them in the form of an array.

Example 1:
Input: nums = [1,2,2,4]
Output: [2,3]
Note:
The given array size will in the range [2, 10000].
The given array's numbers won't have any order.


	var findErrorNums = function(nums) {
	    // x表示重复的数字，y表示缺少的数字
	    let x, y;
	    // sum计算给出的数组个元素之和。
	    // 原来的时候是 (n + 1) * n / 2。现在是 (n + 1) * n / 2 + x - y
	    let sum = 0;
	    // 初始化一个数组储存每个数字出现次数，
	    // 长度为给出数组长的长度，默认值填充为0
	    let times = new Array(nums.length).fill(0);
	    for (let n of nums) {
	        sum += n;
	        // 如果遍历到某个数，就增加相应数字的索引位置的次数
	        // 但是有一点是给出的数是1到n，索引却是0到n-1.
	        // 所以有一个1的补偿量
	        times[n - 1]++;
	        // 一旦找出某数的出现次数不止一次，就找到了x
	        if (times[n - 1] === 2) {
	            x = n;
	        }
	    }
	    // 通过数组之和来确定y
	    y = (n + 1) * n / 2 + x - sum;
	    return [x, y];
	};