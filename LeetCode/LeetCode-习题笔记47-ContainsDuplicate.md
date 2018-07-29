---
title: LeetCode-习题笔记47-ContainsDuplicate
date: 2017-08-21 20:54:41
tags:
---


Given an array of integers, find if the array contains any duplicates. Your function should return true if any value appears at least twice in the array, and it should return false if every element is distinct.

	var containsDuplicate = function(nums) {
	    let set = new Set(nums);
	    return set.size !== nums.length;
	};