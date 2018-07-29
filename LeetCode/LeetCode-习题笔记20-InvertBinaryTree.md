---
title: LeetCode-习题笔记20-Invert Binary Tree
date: 2017-08-19 09:54:28
tags:
---


Invert a binary tree.

     4
   /   \
  2     7
 / \   / \
1   3 6   9
to
     4
   /   \
  7     2
 / \   / \
9   6 3   1
Trivia:
This problem was inspired by this original tweet by Max Howell:
Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so fuck off.



层次便利+翻转

	
	var invertTree = function(root) {
	    let nodes = [];
	    if (root) {
	        nodes = [root]; 
	    }
	    let num  = 0;
	    while (nodes.length) {
	        num = nodes.length;
	        while (num--) {
	            let popNode = nodes.shift();
	            if (popNode.left || popNode.right) {
	                swapChild(popNode);
	            }
	            if (popNode.left) nodes.push(popNode.left);
	            if (popNode.right) nodes.push(popNode.right);
	        }
	    }
	    return root;
	};
	
	function swapChild(node) {
	    if (node.left === null) {
	        node.left = node.right;
	        node.right = null;
	    } else if (node.right === null) {
	        node.right = node.left;
	        node.left = null;
	    } else {
	        let tempNode = node.left;
	        node.left = node.right;
	        node.right = tempNode;
	    }
	}

也可以采用递归，先序遍历与后序遍历都可以，中序遍历不可以：

	var invertTree = function(root) {
	    preOrderTraversal(root);
	    return root;
	};
	
	function preOrderTraversal(node) {
	    if (node) {
	        swapChild(node);
	        preOrderTraversal(node.left);
	        preOrderTraversal(node.right)
	    }
	}
	
	function swapChild(node) {
	    if (node.left === null) {
	        node.left = node.right;
	        node.right = null;
	    } else if (node.right === null) {
	        node.right = node.left;
	        node.left = null;
	    } else {
	        let tempNode = node.left;
	        node.left = node.right;
	        node.right = tempNode;
	    }
	}