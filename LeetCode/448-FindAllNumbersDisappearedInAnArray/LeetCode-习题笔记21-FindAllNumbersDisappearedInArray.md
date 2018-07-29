---
title: LeetCode-习题笔记21-FindAllNumbersDisappearedInArray
date: 2017-08-19 11:13:34
tags:
---



Given an array of integers where 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once.

Find all the elements of [1, n] inclusive that do not appear in this array.

Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.

Example:

Input:
[4,3,2,7,8,2,3,1]

Output:
[5,6]

	var findDisappearedNumbers = function(nums) {
	    let arr = [];
	    for (let i = 1; i < i <= nums.length; i++) {
	        if (nums.findIndex(x => x === i) === -1) {
	            arr.push(i);
	        }
	    }
	    return arr;
	};

这样写超时了。
另外有种方法，我没太看懂。


    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> ret = new ArrayList<Integer>();
        
        for(int i = 0; i < nums.length; i++) {
            int val = Math.abs(nums[i]) - 1;
            if(nums[val] > 0) {
                nums[val] = -nums[val];
            }
        }
        
        for(int i = 0; i < nums.length; i++) {
            if(nums[i] > 0) {
                ret.add(i+1);
            }
        }
        return ret;
    }