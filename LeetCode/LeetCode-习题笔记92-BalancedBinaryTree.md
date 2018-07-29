---
title: LeetCode-习题笔记92-BalancedBinaryTree
date: 2017-08-29 11:07:05
tags:
---


Given a binary tree, determine if it is height-balanced.

For this problem, a height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of every node never differ by more than 1.

先序遍历，记录遍历路径长度，进行比较。

一开始的答案是这样的：

	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {boolean}
	 */
	var isBalanced = function(root) {
	    let lengths = [];
	    let length = 0;
	    preOrderTraversal(root, 0, lengths);
	    let minLen = maxLen = lengths[0];
	    for (let len of lengths) {
	        if (len < minLen) {
	            minLen = len;
	        }
	        if (len > maxLen) {
	            maxLen = len;
	        }
	    }
	    return maxLen - minLen <= 1;
	};
	
	function preOrderTraversal(root, length, lengths) {
	    if (root) {
	        length++;
	        preOrderTraversal(root.left, length, lengths);
	        preOrderTraversal(root.right, length, lengths);
	    } else {
	        lengths.push(length);
	    }
	}

没有通过测试。

首先什么是二叉平衡树？它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。

之前的思路有一点没有考虑到的就是虽然两棵大的子树之间的高度差不超过1，但是有可能子树内部的高度差进行累计。会出现一种是二叉平衡树，但是分支只差大于1的情况。例如一棵树有两棵子树，左侧高度为5，右侧高度为4；其中右子树的某一分支高度为3。这个时候5-3=2>1。
虽然leetcode上对二叉平衡树的定义在讨论区也有很多分歧，但是我查阅中文的相关定义与一些例子确实是考虑的不是很周全。
那就对之前的代码进行改进，判断任意结点的两个子树的差值，而不是对所有分支的高度进行比较。网上给出了一种java的方法挺好：

	public class Solution {
	    public boolean isBalanced(TreeNode root) {
	        if(root == null) return true;
	        if(Math.abs(height(root.left) - height(root.right)) > 1) return false;
	        return isBalanced(root.left) && isBalanced(root.right);
	    }
	    public int height(TreeNode node){
	        if(node == null) return 0;
	        return Math.max(height(node.left), height(node.right)) + 1;
	    }
	}

这种方法的巧妙之处在于height其中的方法。怎样求一棵树的深度呢？就是遇到一层不断加一，一直到根节点为止。
对每一个结点进行递归，判断做右结点的深度差值。计算深度也是用的递归。学习了！
最后js代码如下：

	var isBalanced = function(root) {
	    if (root === null) {
	        return true;
	    }
	    let balanced = isBalanced(root.left) && isBalanced(root.right);
	    return balanced && Math.abs(height(root.left) - height(root.right)) <= 1;
	};
	
	function height(root) {
	    if (root === null) {
	        return 0;
	    }
	    return Math.max(height(root.left), height(root.right)) + 1;
	}