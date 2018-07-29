---
title: LeetCode-习题笔记40-BinaryTreeTilt
date: 2017-08-21 12:08:20
tags:
---


Given a binary tree, return the tilt of the whole tree.

The tilt of a tree node is defined as the absolute difference between the sum of all left subtree node values and the sum of all right subtree node values. Null node has tilt 0.

The tilt of the whole tree is defined as the sum of all nodes' tilt.

Example:
Input: 
         1
       /   \
      2     3
Output: 1
Explanation: 
Tilt of node 2 : 0
Tilt of node 3 : 0
Tilt of node 1 : |2-3| = 1
Tilt of binary tree : 0 + 0 + 1 = 1
Note:

The sum of node values in any subtree won't exceed the range of 32-bit integer.
All the tilt values won't exceed the range of 32-bit integer.



	var findTilt = function(root) {
	    let sum = 0;
	    (function preOrderTraveral(root) {
	        if (root) {
	            preOrderTraveral(root.left);
	            preOrderTraveral(root.right);
	            let left = root.left === null ? 0 : root.left.val;
	            let right = root.right === null ? 0 : root.right.val;
	            sum += Math.abs(left - right);
	            root.val = root.val + left + right;
	        }
	    })(root);
	    return sum;
	};