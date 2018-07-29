---
title: LeetCode-习题笔记69-BinaryTreeLevelOrderTraversalII
date: 2017-08-25 14:12:08
tags:
---


Given a binary tree, return the bottom-up level order traversal of its nodes' values. (ie, from left to right, level by level from leaf to root).

For example:
Given binary tree [3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7
return its bottom-up level order traversal as:
[
  [15,7],
  [9,20],
  [3]
]

    var levelOrderBottom = function(root) {
        let treeArr = [];
        if (root === null) {
            return treeArr;
        }
        // nodes用于储存当前层次的所有结点，以便于遍历
        let nodes = [root];
        // 进行层次遍历
        while (nodes.length) {
            // row是一个临时数组，表示当前层次的结点，他作为最后输出的treeArr的一个元素
            let row = [];
            let length = nodes.length;
            while (length--) {
                let node = nodes.shift();
                row.push(node.val);
                if (node.left !== null) nodes.push(node.left);
                if (node.right !== null) nodes.push(node.right);
            }
            treeArr.unshift(row);
        }
        return treeArr;
    };
