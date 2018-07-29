---
title: LeetCode-习题笔记30-IntersectionOfTwoArrays
date: 2017-08-20 19:13:45
tags:
---


Given two arrays, write a function to compute their intersection.

Example:
Given nums1 = [1, 2, 2, 1], nums2 = [2, 2], return [2].

Note:
Each element in the result must be unique.
The result can be in any order.


	var intersection = function(nums1, nums2) {
	    let set1 = new Set(nums1);
	    let set2 = new Set(nums2);
	    console.log(set1, set2);
	    let intersection = [];
	    for (let num1 of set1) {
	        for (let num2 of set2) {
	            if (num2 === num1) {
	                intersection.push(num2);
	            }
	        }
	    }
	    return intersection;
	};