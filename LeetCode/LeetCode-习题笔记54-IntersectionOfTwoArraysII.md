---
title: LeetCode-习题笔记54-IntersectionOfTwoArraysII
date: 2017-08-22 18:04:45
tags:
---


Given two arrays, write a function to compute their intersection.

Example:
Given nums1 = [1, 2, 2, 1], nums2 = [2, 2], return [2, 2].

Note:
Each element in the result should appear as many times as it shows in both arrays.
The result can be in any order.
Follow up:
What if the given array is already sorted? How would you optimize your algorithm?
What if nums1's size is small compared to nums2's size? Which algorithm is better?
What if elements of nums2 are stored on disk, and the memory is limited such that you cannot load all elements into the memory at once?


	var intersect = function(nums1, nums2) {
	    let intersection = [];
	    function compare(a, b) {return a - b}
	    nums1.sort(compare);
	    nums2.sort(compare);
	    let index1 = 0, index2 = 0;
	    while (index1 < nums1.length && index2 < nums2.length) {
	        if (nums1[index1] === nums2[index2]) {
	            intersection.push(nums1[index1]);
	            index2++;
	            index1++;
	        } else if (nums1[index1] < nums2[index2]) {
	            index1++;
	        } else if (nums1[index1] > nums2[index2]) {
	            index2++;
	        }
	    }
	    return intersection;
	};