---
title: LeetCode 习题笔记2 MergeTwoBinaryTrees
date: 2017-07-25 13:13:38
tags:
---

Given two binary trees and imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not.

You need to merge them into a new binary tree. The merge rule is that if two nodes overlap, then sum node values up as the new value of the merged node. Otherwise, the NOT null node will be used as the node of new tree.

给出了两个树，想象当你使用一棵树来覆盖另一棵树的情景：这两棵树中的其中一些结点重叠了，另一些结点则没有重叠。
你需要将他们合并成一棵树。合并的规则就是如果两个结点重叠了，那么就把两个结点的值相加作为合并后结点的值。否则，不为空的那个结点用来作为新的树的结点。

Example 1:
Input: 
	Tree 1                     Tree 2                  
          1                         2                             
         / \                       / \                            
        3   2                     1   3                        
       /                           \   \                      
      5                             4   7                  
Output: 
Merged tree:
	     3
	    / \
	   4   5
	  / \   \ 
	 5   4   7
Note: The merging process must start from the root nodes of both trees.
	给出的条件如下，结点包含值域与指针域。并且传入了参数t1与t2均为结点。需要返回的也是结点
	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} t1
	 * @param {TreeNode} t2
	 * @return {TreeNode}
	 */
	var mergeTrees = function(t1, t2) {
	    
	};
这种题，用C/C++来做比较熟悉。因为有指针，可以使用指针进行操作，用js的话还是第一次写。要返回的是合并后的树的根结点。考虑到树的结构，使用递归应该方便一些。就是判断某一个结点有没有左子树，就要判断相应位置的t1树上的结点有没有左子树与t2树上的结点有没有左子树。如果存在一个左子树，那么新的树的结点就有左子树。如果t1与t2都没有左子树，那么新的结点就没有左子树，这个时候就应当判断这个位置的结点有没有右子树，判断方法与左子树同理。如果一个位置的结点既没有左子树又没有右子树，那么他就是一个叶子结点。
代码如下：
	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} t1
	 * @param {TreeNode} t2
	 * @return {TreeNode}
	 */
	var mergeTrees = function(t1, t2) {
	    var newNode;
	    if (t1 === null) {
	        return newNode = t2;
	    }
	    if (t2 === null) {
	        return newNode = t1;
	    }
	    newNode = new TreeNode(t1.val + t2.val);
	    if (t1.left || t2.left) {
	        newNode.left = mergeTrees(t1.left, t2.left);
	    }
	    if (t1.right || t2.right) {
	        newNode.right = mergeTrees(t1.right, t2.right);
	    }
	    return newNode;
	};
我来解释一下，函数首先运用了递归的思想。如果说两棵树上某个位置结点存在一个以上的左孩子或者右孩子，那么就可以进行继续对其两个位置上的孩子（不必是两个，可以只有一个）进行合并。这个工作是由程序的最后两个if语句块组成的。规则是t1上的左孩子与t2上的左孩子构成了新的结点的左孩子，右孩子同理。
那么新结点的创建就是由三种情况，分别是t1结点为空，t2结点为空，与均不为空。这里其实均不为空的情况可以加一个条件来判断一下增加代码易读性，我这里没写。
主要就是递归的思想。像这种递归的函数，可以首先写在何种条件下进行何种递归，然后再写每次递归的内部执行代码。虽然代码的在空间上的顺序是将递归放在后边，但是先写递归是思路清晰一些的。



等一下，这个方法存疑。好像不能解决那种在同一棵子树位置相差两层以上的情况。说不好说，例如下图：
			A								a
		   / \							   / \
		  B	  C							  b   c
		 /	   							     / \
	    D									d   e
	   /								    
	  E
例如这种情况，第一个二叉树的左侧有A,B,D,E四个结点，而第二棵二叉树左侧b没有左孩子。现在的方法在合并的时候只能合并到D，不能合并到E，因为直接return了。我是这么想的。但是使用测试用例结果这种方法可行。
参考链接中的博文给出了两种方法，第一种方法我能看懂，但是第二种方法是与我这种类似，不过是用C++写的。还是不太理解。这个题先不管，等我问问别人。







参考链接：

1. [http://www.cnblogs.com/grandyang/p/7058935.html](http://www.cnblogs.com/grandyang/p/7058935.html)