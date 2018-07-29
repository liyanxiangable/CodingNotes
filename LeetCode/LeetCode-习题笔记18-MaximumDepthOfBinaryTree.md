---
title: LeetCode-习题笔记18-MaximumDepthOfBinaryTree
date: 2017-08-15 15:14:19
tags:
---


Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

给出一个二叉树，找到他的最大深度。就是从根节点到最远端叶子结点的距离。
要求深度，那就层次遍历好了，每遍历一个层次对应深度加一。

	var maxDepth = function(root) {
	    // 用一数列来储存当前层次的结点, 默认初始化为根节点，并且还要判断根节点是否为空
	    if (root === null) {
	        return 0;
	    }
	    let nodes = [root];
	    let depth = 0;
	    // 循环进行层次的遍历，直到结点数组中不再有结点表示整棵树遍历完成
	    while (nodes.length) {
	        // 对当前层次的结点进行遍历，每进行一次遍历深度增加1
	        // 遍历到一个结点。就将结点移除，并添加他的子结点
	        let length = nodes.length;
	        while (length--) {
	            // 另外需要注意的是元素从数组的一端出，另一端进入。这样才能正确遍历。
	            let node = nodes.shift();
	            if (node.left) nodes.push(node.left);
	            if (node.right) nodes.push(node.right);
	        }
	        depth++;
	    }
	    return depth;
	};






参考链接：

1. [https://leetcode.com/problems/maximum-depth-of-binary-tree/description/](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)
2. 