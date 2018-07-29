---
title: LeetCode-习题笔记80-LowestCommonAncestorOfABinarySearchTree
date: 2017-08-26 11:15:00
tags:
---


Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes v and w as the lowest node in T that has both v and w as descendants (where we allow a node to be a descendant of itself).”

	        _______6______
	       /              \
	    ___2_          ___8__
	   /     \        /      \
	   0      4      7        9
	         / \
	        3   5
For example, the lowest common ancestor (LCA) of nodes 2 and 8 is 6. Another example is LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.


我想从根节点开始对二叉搜索树进行递归遍历，判断以当前结点为根节点的子树有没有p与q这两个子孙结点。如果有，则把LCA设为当前的结点并且继续向下遍历。直到没有同时存在p与q这两个子孙节点为止，停止遍历。此时的LCA进行返回。

那么怎么对p与q这两个结点在以某个节点为根节点的当前子树内进行查找与判断呢？就是对当前的子树进行遍历。寻找有没有与p、q节点值域相同的结点。

不过以上的方法显然麻烦，如果利用二叉搜索树的性质来递归定位LCA结点比较方便。

