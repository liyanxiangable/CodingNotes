---
title: LeetCode-习题笔记103-TwoSum
date: 2017-09-06 21:05:22
tags:
---


Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].


我没想出什么简单的方法来，就是对当前遍历到的数找出他的加数。时间复杂度O(n^2)

	var twoSum = function(nums, target) {
	    for (let i = 0; i < nums.length; i++) {
	        for (let j = i + 1; j < nums.length; j++) {
	            if (nums[i] + nums[j] === target) {
	                return [i, j];
	            }
	        }
	    }
	};

但是讨论区给出了复杂度为O(n)的方法：

	public int[] twoSum(int[] numbers, int target) {
	    int[] result = new int[2];
	    Map<Integer, Integer> map = new HashMap<Integer, Integer>();
	    for (int i = 0; i < numbers.length; i++) {
	        if (map.containsKey(target - numbers[i])) {
	            result[1] = i + 1;
	            result[0] = map.get(target - numbers[i]);
	            return result;
	        }
	        map.put(numbers[i], i + 1);
	    }
	    return result;
	}

用了哈希表，哈希表查找的时间复杂度为O(1)。并且有一点巧妙的就是，这种方法没有先把数组中的数存放到哈希表当中，而是在不断遍历查找的过程中向哈希表中添加元素，这样就减少了遍历的次数。但是受制于标准库，js代码并不能这么写。







参考链接：

[https://discuss.leetcode.com/topic/2447/accepted-java-o-n-solution](https://discuss.leetcode.com/topic/2447/accepted-java-o-n-solution)