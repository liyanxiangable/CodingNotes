---
title: LeetCode-习题笔记37-SumOfLeftLeaves
date: 2017-08-20 22:40:36
tags:
---


Find the sum of all left leaves in a given binary tree.

Example:

    3
   / \
  9  20
    /  \
   15   7

There are two left leaves in the binary tree, with values 9 and 15 respectively. Return 24.


	 /* Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {number}
	 */
	var sumOfLeftLeaves = function(root) {
	    var sum = 0;
	    function preOrderTraversal(root) {
	        if (root) {
	            if (root.left && root.left.left === null && root.left.right === null) {
	                sum += root.left.val;
	            }
	            preOrderTraversal(root.left);
	            preOrderTraversal(root.right);
	        }
	    }
	    preOrderTraversal(root, sum);
	    return sum;
	};