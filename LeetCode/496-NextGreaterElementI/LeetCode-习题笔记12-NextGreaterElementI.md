---
title: LeetCode-习题笔记12-NextGreaterElementI
date: 2017-08-14 14:00:08
tags:
---



You are given two arrays (without duplicates) nums1 and nums2 where nums1’s elements are subset of nums2. Find all the next greater numbers for nums1's elements in the corresponding places of nums2.

The Next Greater Number of a number x in nums1 is the first greater number to its right in nums2. If it does not exist, output -1 for this number.

在nums1中数字x的NGN数是在nums2中第一个大于他的数，如果不存在NGN数，则返回-1。
给你两个数组（无重复）nums1与nums2，其中nums1是nums2的子集，在nums2中找到所有相对应的nums1中的NGN数。


Example 1:
Input: nums1 = [4,1,2], nums2 = [1,3,4,2].
Output: [-1,3,-1]
Explanation:
    For number 4 in the first array, you cannot find the next greater number for it in the second array, so output -1.
    For number 1 in the first array, the next greater number for it in the second array is 3.
    For number 2 in the first array, there is no next greater number for it in the second array, so output -1.
Example 2:
Input: nums1 = [2,4], nums2 = [1,2,3,4].
Output: [3,-1]
Explanation:
    For number 2 in the first array, the next greater number for it in the second array is 3.
    For number 4 in the first array, there is no next greater number for it in the second array, so output -1.
Note:
All elements in nums1 and nums2 are unique.
The length of both nums1 and nums2 would not exceed 1000.


首先对两个数组进行排序，不对，应当是对第二个数组进行排序。然后遍历第一个数组，内部同时遍历第二个数组。
	var nextGreaterElement = function(findNums, nums) {
	    let ngn = []
	    nums.sort(function (a, b) { return a - b });
	    for (let fn of findNums) {
	        for (let i = 0; i < nums.length; i++) {
	            if (fn === nums[i]) {
	                if (typeof nums[i + 1] === 'undefined') {
	                    ngn.push(-1);
	                } else {
	                    ngn.push(nums[i]);
	                }
	            }
	        }
	    }
	    return ngn;
	};
提交代码的时候显示有错误，结合测试用例来看原来是读错题了。话说这个题真是神经病，啰啰嗦嗦说不清楚想输出什么，170多个踩，120多个赞。题目意思是对第一个数组中的某个数，找他在第二个数组中的这个数字之后的比他大的第一个数。

	var nextGreaterElement = function(findNums, nums) {
	    let ngn = [];
	    for (let fn of findNums) {
	        let ngnNum = null;
	        for (let n of nums) {
	            if (fn === n) {
	                ngnNum = -1;
	            }
	            if (ngnNum === -1 && fn < n) {
	                ngnNum = n;
	                break;
	            }
	        }
	        ngn.push(ngnNum);
	    }
	    return ngn;
	};
注意到这个做法的效率是非常低的，于是看了别人的解法。他们使用了ES6的新的数据结构map，时间复杂度直接降低到了O（n），挺好的。新的语法的熟练与掌握就是应当不断地去使用。如下：
	var nextGreaterElement = function(findNums, nums) {
	    return findNums.map(n => {
	        let found = nums.indexOf(n);
	        
            // find the next greater element's index
            while (nums[++found] < n);
            // -1 if not found
            if (found >= nums.length) found = -1;
            else found = nums[found];
	        
	        return found;
	    });
	};
然后这是我改进之后的结果：
	var nextGreaterElement = function(findNums, nums) {
	    let ngn = [];
	    findNums.map(n => {
	        let found = false;
	        for (let i = nums.indexOf(n); i < nums.length; i++) {
	            if (nums[i] > n) {
	                ngn.push(nums[i]);
	                found = true;
	                break;
	            }
	        }
	        if (!found) {
	            ngn.push(-1);
	        }
	    })
	    return ngn;
	};
现在的效率就高多了。



参考链接：

[https://leetcode.com/problems/next-greater-element-i/description/](https://leetcode.com/problems/next-greater-element-i/description/)
[https://discuss.leetcode.com/topic/79287/intuitive-javascript-solution](https://discuss.leetcode.com/topic/79287/intuitive-javascript-solution)
[https://msdn.microsoft.com/zh-cn/library/dn858235](https://msdn.microsoft.com/zh-cn/library/dn858235)