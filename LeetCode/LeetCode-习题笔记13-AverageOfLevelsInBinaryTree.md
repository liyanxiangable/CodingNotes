---
title: LeetCode-习题笔记13-AverageOfLevelsInBinaryTree
date: 2017-08-14 17:14:03
tags:
---



Given a non-empty binary tree, return the average value of the nodes on each level in the form of an array.

给你一个非空的二叉树，以一个数组的形式返回二叉树每层的平均值


Example 1:
Input:
    3
   / \
  9  20
    /  \
   15   7
Output: [3, 14.5, 11]
Explanation:
The average value of nodes on level 0 is 3,  on level 1 is 14.5, and on level 2 is 11. Hence return [3, 14.5, 11].
Note:
The range of node's value is in the range of 32-bit signed integer.



我想就是进行层次遍历。
层次遍历，需要一个容器来储存当前层次的结点，这些就不仔细说了。






参考链接：

1. [https://leetcode.com/problems/average-of-levels-in-binary-tree/description/](https://leetcode.com/problems/average-of-levels-in-binary-tree/description/)
2. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
3. 