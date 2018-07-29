---
title: LeetCode-习题笔记91-FindModeInBinarySearchTree
date: 2017-08-29 09:53:30
tags:
---


Given a binary search tree (BST) with duplicates, find all the mode(s) (the most frequently occurred element) in the given BST.

Assume a BST is defined as follows:

The left subtree of a node contains only nodes with keys less than or equal to the node's key.
The right subtree of a node contains only nodes with keys greater than or equal to the node's key.
Both the left and right subtrees must also be binary search trees.
For example:
Given BST [1,null,2,2],
	   1
	    \
	     2
	    /
	   2
return [2].

Note: If a tree has more than one mode, you can return them in any order.

Follow up: Could you do that without using any extra space? (Assume that the implicit stack space incurred due to recursion does not count).


中序遍历。使用hashMap。


	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {number[]}
	 */
	var findMode = function(root) {
	    let map = new Map();
	    (function inOrderTraversal(root) {
	        if (root) {
	            inOrderTraversal(root.left);
	            if (map.has(root.val)) {
	                let times = map.get(root.val);
	                map.set(root.val, ++times);
	            } else {
	                map.set(root.val, 1);
	            }
	            inOrderTraversal(root.right);
	        }
	    })(root);
	    let maxTimes = 0;
	    for (let value of map.values()) {
	        if (value > maxTimes) {
	            maxTimes = value;
	        }
	    }
	    let modes = [];
	    map.forEach((value, key) => {
	        if (value === maxTimes) {
	            modes.push(key);
	        }
	    })
	    return modes;
	};