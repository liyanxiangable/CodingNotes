---
title: LeetCode-习题笔记25-ConstructStringFromBinaryTree
date: 2017-08-20 12:00:22
tags:
---


You need to construct a string consists of parenthesis and integers from a binary tree with the preorder traversing way.

The null node needs to be represented by empty parenthesis pair "()". And you need to omit all the empty parenthesis pairs that don't affect the one-to-one mapping relationship between the string and the original binary tree.

Example 1:
Input: Binary tree: [1,2,3,4]
       1
     /   \
    2     3
   /    
  4     

Output: "1(2(4))(3)"

Explanation: Originallay it needs to be "1(2(4)())(3()())", 
but you need to omit all the unnecessary empty parenthesis pairs. 
And it will be "1(2(4))(3)".
Example 2:
Input: Binary tree: [1,2,3,null,4]
       1
     /   \
    2     3
     \  
      4 

Output: "1(2()(4))(3)"

Explanation: Almost the same as the first example, 
except we can't omit the first parenthesis pair to break the one-to-one mapping relationship between the input and the output.


	var tree2str = function(t) {
	    let string = '';
	    function preOrderTraversal(t) {
	        string += t.val;
	        if (t.left !== null) {
	            string += '(';
	            preOrderTraversal(t.left);
	            string += ')';            
	        }
	        if (t.right !== null) {
	            if (t.left === null) {
	                string += '()';
	            }
	            string += '(';
	            preOrderTraversal(t.right);
	            string += ')';            
	        }
	    }
	    if (t !== null) {
	        preOrderTraversal(t);  
	    }
	    return string;
	};