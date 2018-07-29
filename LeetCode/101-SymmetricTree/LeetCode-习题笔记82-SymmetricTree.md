---
title: LeetCode-习题笔记82-SymmetricTree
date: 2017-08-27 21:58:14
tags:
---


Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).

For example, this binary tree [1,2,2,3,4,4,3] is symmetric:

    1
   / \
  2   2
 / \ / \
3  4 4  3	 
But the following [1,2,2,null,3,null,3] is not:
    1
   / \
  2   2
   \   \
   3    3
Note:
Bonus points if you could solve it both recursively and iteratively.

首先想到进行层次遍历，检查每一层的输出字符串是否回文。实际实现上并不容易，所以改用比较的方法，其中要对只有一个孩子的情况进行分类讨论。

	
	var isSymmetric = function(root) {
	    if (root === null) return true;
	    let nodes1 = [root];
	    while (nodes1.length) {
	        let len = nodes1.length;
	        for (let i = 0; i < Math.ceil(len / 2); i++) {
	            if (nodes1[i].val !== nodes1[len - 1 - i].val) {
	                return false;
	            }
	            if (nodes1[i].left === null && nodes1[len - 1 - i].right !== null) {
	                return false;
	            }
	            if (nodes1[i].right === null && nodes1[len - 1 - i].left !== null) {
	                return false;
	            }
	        }
	        while (len--) {
	            let node = nodes1.pop();
	            if (node.left && node.right) {
	                nodes1.unshift(node.left);
	                nodes1.unshift(node.right);
	            } else if (node.left === null && node.right !== null) {
	                nodes1.unshift(new TreeNode(null));
	                nodes1.unshift(node.right);
	            } else if (node.left !== null && node.right === null) {
	                nodes1.unshift(node.left);
	                nodes1.unshift(new TreeNode(null));
	            }
	        }
	    }
	    return true;
	};

以上的方法可以实现，但是效率比较低。网上有人给出java的递归方法：

	public boolean isSymmetric(TreeNode root) {
	    return root==null || isSymmetricHelp(root.left, root.right);
	}
	
	private boolean isSymmetricHelp(TreeNode left, TreeNode right){
	    if(left==null || right==null)
	        return left==right;
	    if(left.val!=right.val)
	        return false;
	    return isSymmetricHelp(left.left, right.right) && isSymmetricHelp(left.right, right.left);
	}

注意研究别人是怎么写的，如果要使用递归，那么比较的是两个结点，并且对结点的孩子结点进行递归。所以当初始时，给出的确是一个根节点或者根节点为空。这个时候先对根节点进行判断，并且将根节点的左右孩子进行比较。这样比较的实现是在另一个函数内部的，在另一个函数中进行递归的好处就是模块化，低耦合。当然也减少了重复无用的语句。

就是将一个结点的左右孩子进行比较。当左右孩子中有一个为null的时候，那么另一个必为null才对称，这个时候结点没有孩子，就不能向下进行递归。如果都不为空，那么比较左右孩子的值域，值域必须相等才对称，一旦发现值域不相等就判断为不对称。然后如果左右两个孩子的值域也相等，就要继续向下进行判断。此时判断的结点就一共有四个。以前左结点的左孩子要与右结点的右孩子比较；以前左结点的右孩子要与右结点的左孩子比较。等切返回他们的相与的结果。

这种方法的js代码实现如下：
