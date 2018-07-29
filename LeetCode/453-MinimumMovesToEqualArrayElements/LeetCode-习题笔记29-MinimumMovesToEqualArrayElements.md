---
title: LeetCode-习题笔记29-MinimumMovesToEqualArrayElements
date: 2017-08-20 18:35:00
tags:
---


Given a non-empty integer array of size n, find the minimum number of moves required to make all array elements equal, where a move is incrementing n - 1 elements by 1.

Example:

Input:
[1,2,3]

Output:
3

Explanation:
Only three moves are needed (remember each move increments two elements):

[1,2,3]  =>  [2,3,3]  =>  [3,4,3]  =>  [4,4,4]


	var minMoves = function(nums) {
	    let times = 0;
	    let equal = isEqual(nums);
	    while (!equal) {
	        nums.sort(function (a, b) { return a - b });
	        for (let i = 0; i < nums.length - 1; i++) {
	            nums[i]++;
	        }
	        equal = isEqual(nums);
	        times++;
	    }
	    return times;
	};
	
	function isEqual(nums) {
	    for (let i = 0; i < nums.length - 1; i++) {
	        if (nums[i] !== nums[i + 1]) {
	            return false;
	        }
	    }
	    return true;
	}


以上是按照流程来写代码，在极端的例子中超出了时间限制，以下是数学方法：

	sum + (n - 1) * m = n * h;
	min + m = h
	
	=>	sum = min * n + h

所以有：


	var minMoves = function(nums) {
	    let sum = 0, min = nums[0];
	    for (let num of nums) {
	        sum += num;
	        if (num < min) {
	            min = num;
	        }
	    }
	    return sum - nums.length * min;
	};