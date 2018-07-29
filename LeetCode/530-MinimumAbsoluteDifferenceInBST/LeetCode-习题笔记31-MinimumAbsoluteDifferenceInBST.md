---
title: LeetCode-习题笔记31-MinimumAbsoluteDifferenceInBST
date: 2017-08-20 20:12:54
tags:
---


Given a binary search tree with non-negative values, find the minimum absolute difference between values of any two nodes.

Example:

Input:

   1
    \
     3
    /
   2

Output:
1

Explanation:
The minimum absolute difference is 1, which is the difference between 2 and 1 (or between 2 and 3).
Note: There are at least two nodes in this BST.


	var getMinimumDifference = function(root) {
	    let nodes = [];
	    inOrderTraversal(root, nodes);
	    let difference = nodes[1] - nodes[0];
	    for (let i = 1; i < nodes.length - 1; i++) {
	        if (difference > nodes[i + 1] - nodes[i]) {
	            difference = nodes[i + 1] - nodes[i];
	        }
	    }
	    return difference;
	};
	
	function inOrderTraversal(root, nodes) {
	    if (root !== null) {
	        inOrderTraversal(root.left);
	        nodes.push(root.val);
	        inOrderTraversal(root.right);
	    }
	}