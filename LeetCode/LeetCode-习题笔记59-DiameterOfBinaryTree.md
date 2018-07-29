---
title: LeetCode-习题笔记59-DiameterOfBinaryTree
date: 2017-08-22 21:48:23
tags:
---


Given a binary tree, you need to compute the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

Example:
Given a binary tree 
          1
         / \
        2   3
       / \     
      4   5    
Return 3, which is the length of the path [4,2,1,3] or [5,2,1,3].

Note: The length of path between two nodes is represented by the number of edges between them.


对于某一结点，他的直径的计算分为两种情况，一是直径的路径穿过当前结点，二是直径的路径不穿过当前结点。如果是第一种情况，那么显然对于根节点为当前节点的树的直径就是左右两侧的深度之和；对于第二种情况，那么就是将此结点的左右两个孩子作为根节点，找他们的直径。所以当前结点处的直径就是上边两种计算中的较大值。

	
	var diameterOfBinaryTree = function(root) {
	    // current为穿过当前节点的直径，left与right为左右子树的直径
	    let current;
	    // 通过遍历来求得做右子树的深度，如果当前节点为空。此时返回直径0
	    if (root === null) {
	        return 0;
	    }
	    let leftDepth = getDepth(root.left);
	    let rightDepth = getDepth(root.right);
	    current = leftDepth + rightDepth;
	    // 比较左右子树的直径，再与穿过当前节点的直径比较，
	    // 其中最大值为以当前节点为根节点的整棵树的直径，其中做右子树的直径是由递归本函数得到
	    let diameter = Math.max(current, Math.max(diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right)));
	    return diameter;
	};
	
	function getDepth(root) {
	    // 如果root已经不是节点，说明遍历到头了，返回1
	    if (root === null) {
	        return 0
	    } else {
	        // 如果root还有子树可以继续遍历。那就将深度增加一层，
	        // 并且继续寻找当前节点的左右子树的深度的较大值
	        return 1 + Math.max(getDepth(root.left), getDepth(root.right))
	    }
	}