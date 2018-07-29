---
title: LeetCode-习题笔记62-BestTimeToBuyAndSellStock
date: 2017-08-23 18:46:07
tags:
---


Say you have an array for which the ith element is the price of a given stock on day i.

If you were only permitted to complete at most one transaction (ie, buy one and sell one share of the stock), design an algorithm to find the maximum profit.

Example 1:
Input: [7, 1, 5, 3, 6, 4]
Output: 5

max. difference = 6-1 = 5 (not 7-1 = 6, as selling price needs to be larger than buying price)
Example 2:
Input: [7, 6, 4, 3, 1]
Output: 0

In this case, no transaction is done, i.e. max profit = 0.

这种类似寻找最大子数列的题有kadane算法可以解决。kadane算法是一种典型的动态规划算法，对于在数组中寻找最大子数列的问题，只需要O(n)的时间复杂度。
例如，要找出[2, -3, 5, 2, -4, 0, 2, 4, -2]的元素之和最大的连续子数列之和。我们设定若干辅助变量。max_so_far表示截至到当前遍历的元素为止，最大子数列的和，显然到遍历完成之后就是整个数列的最大子数列之和。另外有变量表示当前的有可能的子数列之和max_ending_here，首先有一个前提是子数列的和不可能为负数，即便是空数列。所以对于每一个新元素的遍历，就对max_ending_here进行更新，更新规则是根据max_ending_here当前的值将max_ending_here对当前元素进行累加，如果max_ending_here的值为正，那么不论当前元素的值是正数还是负数，都进行累加。如果max_ending_here的值不是正数，那么就将max_ending_here的值归零，等待下一次的累加。所以在遍历过程中有
	max_ending_here = Math.max(max_ending_here += a[i], 0);
这样我们在遍历的过程中就得到了多个（也有可能零个或一个）这样不同段子数列的累加值，其中最大的累加值就是要找的最大子数列之和。所以有：
	max_so_far = Math.max(max_so_far, max_ending_here);


对于本题而言，不是要求最大子数列的和，而是要求差值。所以上边对应的max_so_far比较的还是其自身与max_ending_here。但是max_ending_here的计算需要修改，之前我们进行累加是因为要求的是子数列的和，现在要求的是差价。而差价怎么计算呢？就是对差值进行累加，并且差价最小为0：
	max_ending_here = Math.max(max_ending_here += a[i] - a[i - 1], 0);



所以答案为：
	var maxProfit = function(prices) {
	    let maxProfitSoFar = 0;
	    let maxProfitEndingHere = 0;
	    for (let i = 0; i < prices.length - 1; i++) {
	        maxProfitEndingHere = Math.max(maxProfitEndingHere += prices[i + 1] - prices[i], 0);
	        maxProfitSoFar = Math.max(maxProfitSoFar, maxProfitEndingHere);
	    }
	    return maxProfitSoFar;
	};




参考链接： 
1. [https://en.wikipedia.org/wiki/Maximum_subarray_problem](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
2. [https://discuss.leetcode.com/topic/19853/kadane-s-algorithm-since-no-one-has-mentioned-about-this-so-far-in-case-if-interviewer-twists-the-input](https://discuss.leetcode.com/topic/19853/kadane-s-algorithm-since-no-one-has-mentioned-about-this-so-far-in-case-if-interviewer-twists-the-input)
3. [http://codeforces.com/blog/entry/13713](http://codeforces.com/blog/entry/13713)