---
title: LeetCode-习题笔记26-ConvertBSTtoGreaterTree
date: 2017-08-20 15:06:05
tags:
---


Given a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus sum of all keys greater than the original key in BST.

Example:

Input: The root of a Binary Search Tree like this:
              5
            /   \
           2     13

Output: The root of a Greater Tree like this:
             18
            /   \
          20     13
	

	var convertBST = function(root) {
	    let nodes = [];
	    function inOrderTraversal(root, arr) {
	        if (root) {
	            inOrderTraversal(root.left, arr);
	            nodes.push(root);
	            inOrderTraversal(root.right, arr);
	        }
	    }
	    inOrderTraversal(root, nodes);
	    for (let i = nodes.length - 2; i >= 0; i--) {
	        nodes[i].val += nodes[i + 1].val;
	    }
	    return root;
	};