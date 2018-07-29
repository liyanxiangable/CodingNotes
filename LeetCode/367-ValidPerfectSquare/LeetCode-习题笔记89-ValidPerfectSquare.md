---
title: LeetCode-习题笔记89-ValidPerfectSquare
date: 2017-08-28 21:09:53
tags:
---


Given a positive integer num, write a function which returns True if num is a perfect square else False.

Note: Do not use any built-in library function such as sqrt.

Example 1:

Input: 16
Returns: True
Example 2:

Input: 14
Returns: False


一开始我想提高点效率，就手动写了个区间：
	var isPerfectSquare = function(num) {
	    let len = num.toString().length;
	    let start;
	    if (len <=3) {
	        start = 0;
	    } else if (len <=6) {
	        start = 30;
	    } else {
	        start = 300;
	    }
	    while (start * start < num) {
	        start++;
	    }
	    return start * start === num || (start - 1) * (start - 1) === num;
	};

后来觉得不太好，太没水平。使用二分法。没什么好说的，注意边界条件：

	/**
	 * @param {number} num
	 * @return {boolean}
	 */
	var isPerfectSquare = function(num) {
	    let low = 1, high = num;
	    while (low <= high) {
	        let mid = Math.floor((low + high) / 2);
	        let square = mid * mid;
	        if (square < num) {
	            low = mid + 1;
	        } else if (square > num) {
	            high = mid - 1;
	        } else {
	            return true;
	        }
	    }
	    return false;
	};