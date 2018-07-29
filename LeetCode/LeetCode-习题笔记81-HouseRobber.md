---
title: LeetCode-习题笔记81-HouseRobber
date: 2017-08-27 17:06:05
tags:
---



You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security system connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without alerting the police.


也就是说给出一个数组，找出一组位置上两两不相邻的数，并且要求这组数的和最大。这类不确定的、阶段相互联系的问题，一般是动态规划的思路。动态规划就是要找递推关系。参考链接讲得很好。

状态转移方程：

dp[0] = num[0] （当i=0时）
dp[1] = max(num[0], num[1]) （当i=1时）
dp[i] = max(num[i] + dp[i - 2], dp[i - 1])   （当i !=0 and i != 1时）

以下是直接根据递推公式写的代码：
	
	var rob = function(nums) {
	    if (nums.length === 0) {
	        return 0;
	    }
	    if (nums.length === 1) {
	        return nums[0];
	    }
	    let dp = new Array(nums);
	    dp[0] = nums[0];
	    dp[1] = Math.max(nums[0], nums[1]);
	
	    for (let i = 2; i < nums.length; i++) {
	        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
	    }
	
	    return dp[dp.length - 1];
	};

以下是将递推公式优化后，降低空间复杂度的代码：

	var rob = function(nums) {
	    if (nums.length === 0) {
	        return 0;
	    }
	    if (nums.length === 1) {
	        return nums[0];
	    }
	    let dpPrevPrev = nums[0];
	    let dpPrev = Math.max(nums[0], nums[1]);
	    let dpNow = dpPrev;
	    for (let i = 2; i < nums.length; i++) {
	        dpNow = Math.max(dpPrev, dpPrevPrev + nums[i]);
	        dpPrevPrev = dpPrev;
	        dpPrev = dpNow;
	    }
	    return dpNow;
	};


参考链接：

1. [http://www.cnblogs.com/grandyang/p/4383632.html](http://www.cnblogs.com/grandyang/p/4383632.html)
2. [http://blog.csdn.net/chilseasai/article/details/50631233](http://blog.csdn.net/chilseasai/article/details/50631233)
3. [https://segmentfault.com/a/1190000003811581](https://segmentfault.com/a/1190000003811581)
4. [https://yq.aliyun.com/articles/3521](https://yq.aliyun.com/articles/3521)
