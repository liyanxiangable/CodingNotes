---
title: LeetCode-习题笔记17-MaxConsecutiveOnes
date: 2017-08-15 12:29:29
tags:
---


Given a binary array, find the maximum number of consecutive 1s in this array.

给出一个二进制的数组，找出用连续1表示的最大的数


Example 1:
Input: [1,1,0,1,1,1]
Output: 3
Explanation: The first two digits or the last three digits are consecutive 1s.
    The maximum number of consecutive 1s is 3.
Note:

The input array will only contain 0 and 1.
The length of input array is a positive integer and will not exceed 10,000


由于有自带的数组操作函数，这个题用js做很简单。
	var findMaxConsecutiveOnes = function(nums) {
	    var arrs = nums.join('').split(0);
	    let length = 0;
	    for (let arr of arrs) {
	        if (arr.length > length) {
	            length = arr.length;
	        }
	    }
	    return length;
	};
不用js的方法也可以：
	var findMaxConsecutiveOnes = function(nums) {
	    let maxLength = 0;
	    let length = 0;
	    for (let num of nums) {
	        if (num === 1) {
	            length++;
	        } else if (num === 0) {
	            length = 0;
	        }
	        if (maxLength < length) {
	            maxLength = length;
	        }
	    }
	    return maxLength;
	};



参考链接：

1. [https://leetcode.com/problems/max-consecutive-ones/description/](https://leetcode.com/problems/max-consecutive-ones/description/)