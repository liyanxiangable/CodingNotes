---
title: LeetCode-习题笔记74-SearchInsertPosition
date: 2017-08-25 21:08:02
tags:
---


Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You may assume no duplicates in the array.

Here are few examples.
[1,3,5,6], 5 → 2
[1,3,5,6], 2 → 1
[1,3,5,6], 7 → 4
[1,3,5,6], 0 → 0


	// 注意边界条件
	var searchInsert = function(nums, target) {
	    let position = 0;
	    if (target <= nums[0]) {
	        return 0;
	    }
	    if (target === nums[nums.length - 1]) {
	        return nums.length - 1;
	    }
	    if (target > nums[nums.length - 1]) {
	        return nums.length
	    }
	    for (let i = 0; i < nums.length; i++) {
	        if (target > nums[i]) {
	            position = i;
	        } else {
	            position++;
	            break;
	        }
	    }
	    return position;
	};