---
title: LeetCode-习题笔记35-TwoSumII-InputArrayIsSorted
date: 2017-08-20 21:46:59
tags:
---


Given an array of integers that is already sorted in ascending order, find two numbers such that they add up to a specific target number.

The function twoSum should return indices of the two numbers such that they add up to the target, where index1 must be less than index2. Please note that your returned answers (both index1 and index2) are not zero-based.

You may assume that each input would have exactly one solution and you may not use the same element twice.

Input: numbers={2, 7, 11, 15}, target=9
Output: index1=1, index2=2

	var twoSum = function(numbers, target) {
	    let index1 = 0, index2 = numbers.length - 1;
	    let sum = numbers[index1] + numbers[index2];
	    while (sum !== target) {
	        if (sum > target) {
	            index2--;
	        } else if (sum < target) {
	            index1++;
	        }
	        sum = numbers[index1] + numbers[index2];
	    }
	    return [index1 + 1, index2 + 1];
	};