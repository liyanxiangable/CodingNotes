---
title: LeetCode-习题笔记96-ArrangingCoins
date: 2017-08-29 19:51:15
tags:
---


You have a total of n coins that you want to form in a staircase shape, where every k-th row must have exactly k coins.

Given n, find the total number of full staircase rows that can be formed.

n is a non-negative integer and fits within the range of a 32-bit signed integer.

Example 1:

n = 5

The coins can form the following rows:
¤
¤ ¤
¤ ¤

Because the 3rd row is incomplete, we return 2.
Example 2:

n = 8

The coins can form the following rows:
¤
¤ ¤
¤ ¤ ¤
¤ ¤

Because the 4th row is incomplete, we return 3.


	/**
	 * @param {number} n
	 * @return {number}
	 */
	var arrangeCoins = function(n) {
	    if (n === 0) return 0;
	    let i;
	    for (i = 1; n >= 0; i++) {
	        n -= i;
	    }
	    return i - 2;
	};

当然这个题也可以通过等差数列来求。