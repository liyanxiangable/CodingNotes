---
title: LeetCode-习题笔记56-MissingNumber
date: 2017-08-22 19:37:41
tags:
---


Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.

For example,
Given nums = [0, 1, 3] return 2.

Note:
Your algorithm should run in linear runtime complexity. Could you implement it using only constant extra space complexity?

Credits:
Special thanks to @jianchao.li.fighter for adding this problem and creating all test cases.



	var missingNumber = function(nums) {
	    nums.sort(function (a, b) {
	        return a - b;
	    });
	    if (nums[0] !== 0) {
	        return 0;
	    }
	    let miss;
	    for (let i = 0; i < nums.length - 1; i++) {
	        if (nums[i + 1] - nums[i] !== 1) {
	            miss = nums[i] + 1;
	        }
	    }
	    return typeof miss === 'undefined' ? nums[nums.length - 1] + 1 : miss;
	};

	var missingNumber = function(nums) {
	    let len = nums.length;
	    let sum = (0 + len) * (len + 1) / 2;
	    for (let n of nums) {
	        sum -= n;
	    }
	    return sum;
	};