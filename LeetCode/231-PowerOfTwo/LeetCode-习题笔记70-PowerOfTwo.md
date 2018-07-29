---
title: LeetCode-习题笔记70-PowerOfTwo
date: 2017-08-25 14:31:43
tags:
---


Given an integer, write a function to determine if it is a power of two.

	var isPowerOfTwo = function(n) {
	    if (n <= 0) {
	        return false;
	    }
	    // 当n为2的x次幂的时候，其二进制首位为1，其余位为0
	    // 此时n-1所有位均为1，两者相与，所有位为1，最后取非为0
	    return !(n & (n - 1));
	};