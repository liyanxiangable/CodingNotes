---
title: LeetCode-习题笔记71-ClimbingStairs
date: 2017-08-25 14:53:01
tags:
---



You are climbing a stair case. It takes n steps to reach to the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Note: Given n will be a positive integer.
	
	
	var climbStairs = function(n) {
	    let kinds = 0;
	    // 假设某种路径中一次走两个台阶的步数是x步
	    // 对于非负数n来说，2x <= n
	    // 所以有x为0到[n / 2]个这样的情况
	    let x = 0;
	    while (2 * x <= n) {
	        // 对某个x进行n台阶内部的不同情况遍历
	
	        // 其实就是在n-1个（剩下最后一个台阶时，不能一步走两个台阶）位置中找x个
	        // 即为计算C(x, n)
	        /*
	        let numerator = denominator = 1;
	        for (let i = 0; i < x; i++) {
	            numerator *= n - i;
	            denominator *= x - i;
	        }
	        kinds += numerator / denominator;
	        */
	
	        // 以上的方法有错误，原因在于当某个台阶m走一步走俩阶的时候
	        // m+1阶是不能有选择的，但是上边的方法算上了
	        // 当两阶一步的步数有x时，那么一阶一步的步数有y = n - 2 * x
	        // 所以实际上现在的问题是对于两种元素分别有x与y个能够有多少种排列的问题
	        // 进而转化为一共有x + y(算数结果为n - x)个元素，要在其中放置x个某种元素的数学问题C(x, x + y)
	
	        let numerator = denominator = 1;
	        for (let i = 0; i < x; i++) {
	            numerator *= n - x - i;
	            denominator *= x - i;
	        }
	        kinds += numerator / denominator;
	        x++;
	    }
	    return kinds;
	};