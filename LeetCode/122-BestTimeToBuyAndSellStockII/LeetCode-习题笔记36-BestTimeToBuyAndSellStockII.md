---
title: LeetCode-习题笔记36-BestTimeToBuyAndSellStockII
date: 2017-08-20 22:20:45
tags:
---


Say you have an array for which the ith element is the price of a given stock on day i.

Design an algorithm to find the maximum profit. You may complete as many transactions as you like (ie, buy one and sell one share of the stock multiple times). However, you may not engage in multiple transactions at the same time (ie, you must sell the stock before you buy again).


	var maxProfit = function(prices) {
	    let profit = 0;
	    for (let i = 0; i < prices.length; i++) {
	        if (prices[i + 1] > prices[i]) {
	            profit += prices[i + 1] - prices[i];
	        }
	    }
	    return profit;
	};