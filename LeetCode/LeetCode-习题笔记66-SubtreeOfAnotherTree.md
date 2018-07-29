---
title: LeetCode-习题笔记66-SubtreeOfAnotherTree
date: 2017-08-24 20:46:33
tags:
---


Given two non-empty binary trees s and t, check whether tree t has exactly the same structure and node values with a subtree of s. A subtree of s is a tree consists of a node in s and all of this node's descendants. The tree s could also be considered as a subtree of itself.

Example 1:
Given tree s:

     3
    / \
   4   5
  / \
 1   2
Given tree t:
   4 
  / \
 1   2
Return true, because t has the same structure and node values with a subtree of s.
Example 2:
Given tree s:

     3
    / \
   4   5
  / \
 1   2
    /
   0
Given tree t:
   4
  / \
 1   2
Return false.

我想的是通过遍历得到的字符串的比较，我看网上也有很多人是这样做的。但是有一点不太明白的是像题目给出的第二个例子这样，后面有多出的元素，这样通过字符串的判断也可以吗。是可以的，因为在一个子树中如果有多出的元素，不论是先序遍历、中序遍历还是后续遍历，都会打乱子树字符串内部的顺序，从而与另一个字符串区别。然后就是为了对不同位置的孩子进行区别，在遍历的时候应当对子树为空的时候进行输出一个特殊的标志。最后一点就是为了防止多个元素的值域与另一棵树上的某一元素的值域相混淆，例如1、2与12，在遍历每一个元素开始与结束的时候都应当添加一个结束的标志。


	var isSubtree = function(s, t) {
	    let sString = tString =  '';
	    sString = convertToString(s, sString);
	    tString = convertToString(t, tString);
	    return sString.indexOf(tString) !== -1;
	};
	
	function convertToString(root, string) {
	    // 对于每一个元素都应当使用标志间隔
	    string += ',';
	    if (root !== null) {
	        string += root.val;
	        string = convertToString(root.left, string);
	        string = convertToString(root.root, string);
	    } else {
	        // 当结点为空的时候，也应当答应特殊标志。才可以保证子树相同
	        string += '#';
	    }
	    // 对于每一个元素都应当使用标志间隔
	    string += ',';
	    return string;
	}

另外有一种不断遍历第一棵树，然后判断以这个结点为根节点的子树是否与另一棵树完全相同。不断进行比较，直到相同或者遍历完成。这种方法比较而言复杂度略高。





参考链接： 

1. [https://segmentfault.com/a/1190000009409199](https://segmentfault.com/a/1190000009409199)
2. [http://blog.csdn.net/wyh476901857/article/details/71434273](http://blog.csdn.net/wyh476901857/article/details/71434273)
3. [https://discuss.leetcode.com/topic/88508/java-solution-tree-traversal](https://discuss.leetcode.com/topic/88508/java-solution-tree-traversal)