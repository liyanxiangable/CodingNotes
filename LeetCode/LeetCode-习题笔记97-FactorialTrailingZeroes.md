---
title: LeetCode-习题笔记97-FactorialTrailingZeroes
date: 2017-08-29 20:19:55
tags:
---


Given an integer n, return the number of trailing zeroes in n!.

Note: Your solution should be in logarithmic time complexity.


计算末尾有几个0，首先0是由 2 * 5 * x 或者 10 * y 得到的。每一组以上的数字相乘可以形成一个0。所以可以转化问题为一个数 n 是 a 个 10 组成余 b。可以形成 2 * a 个 0，并且余数 b 大于 5 的话也可以形成一个0。
另外有一点我没有想到的是，0 不光是由 10 产生 1 个 0，而且还会由 100 产生 2 个 0。所以每当 25 的整数倍的时候会产生 2 个 0 而非 1 个 0。进而，每当 125 的整数倍的时候产生 3 个 0。。。。以此类推。得到一个数中包含 n 个 5^1 得到 n 个 0；m 个 5^2 得到 2 * m 个 0.。。。。


	/**
	 * @param {number} n
	 * @return {number}
	 */
	var trailingZeroes = function(n) {
	    let zeros = 0;
	    for (let i = 5; i <= n; i *= 5) {
	        zeros += Math.floor(n / i);
	    }
	    return zeros;
	};