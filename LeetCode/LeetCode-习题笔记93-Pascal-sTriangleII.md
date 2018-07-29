---
title: LeetCode-习题笔记93-Pascal'sTriangleII
date: 2017-08-29 17:42:36
tags:
---


Given an index k, return the kth row of the Pascal's triangle.

For example, given k = 3,
Return [1,3,3,1].

Note:
Could you optimize your algorithm to use only O(k) extra space?

与之前的一样，第n行的m个数可表示为 C(n-1，m-1)来求得通项（二项式系数）。这里给出的k是从0开始的。

	/**
	 * @param {number} rowIndex
	 * @return {number[]}
	 */
	var getRow = function(rowIndex) {
	    let row = []
	    for (let i = 0; i < rowIndex + 1; i++) {
	        row[i] = combination(i, rowIndex);
	    }
	    return row;
	};
	
	function combination(m, n) {
	    if (m === 0) return 1;
	    let a = b = c = 1, p = n - m;
	    while (m > 0) {
	        a *= m--;
	    }
	    while (n > 0) {
	        b *= n--;
	    }
	    while (p > 0) {
	        c *= p--;
	    }
	    return b / a / c;
	}