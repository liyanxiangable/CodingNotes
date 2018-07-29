---
title: LeetCode-习题笔记98-RemoveDuplicatesFromSortedArray
date: 2017-08-29 20:58:59
tags:
---


Given a sorted array, remove the duplicates in place such that each element appear only once and return the new length.

Do not allocate extra space for another array, you must do this in place with constant memory.

For example,
Given input array nums = [1,1,2],

Your function should return length = 2, with the first two elements of nums being 1 and 2 respectively. It doesn't matter what you leave beyond the new length.


与数组中前一个元素判断是否重复，重复的话就递增duplications的值；继续遍历，之后的所有元素都向前移动duplications个位置。


	var removeDuplicates = function(nums) {
	    let duplications = 0;
	    for (let i = 0; i < nums.length; i++) {
	        if (nums[i] === nums[i - 1]) {
	            duplications++;
	        }
	        nums[i - duplications] = nums[i];
	    }
	    return nums.length - duplications;
	};