---
title: LeetCode-习题笔记60-ConvertSortedArrayToBinarySearchTree
date: 2017-08-23 12:42:36
tags:
---


Given an array where elements are sorted in ascending order, convert it to a height balanced BST.


二叉搜索树的中序遍历可以得到升序序列。
于是应当不断找出中间大小数值作为的子树根结点的值域。

	var sortedArrayToBST = function(nums) {
	    if (nums.length === 0) {
	        return null;
	    }
	    let middle = Math.floor(nums.length / 2);
	    let root = new TreeNode(nums[middle]);
	    root.left = sortedArrayToBST(nums.slice(0, middle));
	    root.right = sortedArrayToBST(nums.slice(middle + 1));
	    return root;
	};