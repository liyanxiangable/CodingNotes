---
title: LeetCode-习题笔记75-MaximumSubarray
date: 2017-08-25 21:59:21
tags:
---


Find the contiguous subarray within an array (containing at least one number) which has the largest sum.

For example, given the array [-2,1,-3,4,-1,2,1,-5,4],
the contiguous subarray [4,-1,2,1] has the largest sum = 6.

click to show more practice.

More practice:
If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.


动态规划，kadane算法。其中需要注意如果都是负数，那么也应当输出最大值。所以两个变量都初始化为数组的第一个元素。这样的话为了避免第一个元素重复计算，所以在第二个元素开始遍历。


	var maxSubArray = function(nums) {
	    let maxSoFar = nums[0];
	    let maxEndingHere = nums[0];
	    for (let i = 1; i < nums.length; i++) {
	        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
	        maxSoFar = Math.max(maxSoFar, maxEndingHere);
	    }
	    return maxSoFar;
	};