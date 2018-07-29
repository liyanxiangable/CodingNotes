---
title: LeetCode-习题笔记101-PalindromeNumber
date: 2017-09-06 20:11:51
tags:
---




Determine whether an integer is a palindrome. Do this without extra space.



判断数字是否回文，最直观的想法是对各位进行比较：


	/**
	 * @param {number} x
	 * @return {boolean}
	 */
	var isPalindrome = function(x) {
	    for (let i = 0; i < Math.ceil(x.toString().length / 2); i++) {
	        if (x.toString()[i] !== x.toString()[x.toString().length - 1 - i]) {
	            return false;
	        }
	    }
	    return true;
	};