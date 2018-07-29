---
title: LeetCode-习题笔记86-BinaryTreePaths
date: 2017-08-28 18:12:32
tags:
---


Given a binary tree, return all root-to-leaf paths.

For example, given the following binary tree:

   1
 /   \
2     3
 \
  5
All root-to-leaf paths are:

["1->2->5", "1->3"]

我的想法是递归进行先序遍历，并记录路径。


	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {string[]}
	 */
	var binaryTreePaths = function(root) {
	    let strArr = [];
	    let string = '';
	    preOrder2String(root, string, strArr);
	    return strArr;
	};
	
	var preOrder2String = function(root, string, strArr) {
	    if (root) {
	        if (root.left === null && root.right === null) {
	            string += root.val
	            strArr.push(string);
	            return;
	        }
	        string += root.val + '->';
	        preOrder2String(root.left, string, strArr);
	        preOrder2String(root.right, string, strArr);
	    } 
	}