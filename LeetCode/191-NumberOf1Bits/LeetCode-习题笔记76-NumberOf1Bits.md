---
title: LeetCode-习题笔记76-NumberOf1Bits
date: 2017-08-25 22:49:27
tags:
---


Write a function that takes an unsigned integer and returns the number of ’1' bits it has (also known as the Hamming weight).

For example, the 32-bit integer ’11' has binary representation 00000000000000000000000000001011, so the function should return 3.

	
	var hammingWeight = function(n) {
	    let count = 0;
	    while (n) {
	        count += n & 1;
	        n = n >>> 1;
	    }
	    return count;
	};