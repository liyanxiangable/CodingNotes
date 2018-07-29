---
title: LeetCode-习题笔记72-PathSumIII
date: 2017-08-25 15:48:29
tags:
---


You are given a binary tree in which each node contains an integer value.

Find the number of paths that sum to a given value.

The path does not need to start or end at the root or a leaf, but it must go downwards (traveling only from parent nodes to child nodes).

The tree has no more than 1,000 nodes and the values are in the range -1,000,000 to 1,000,000.

Example:

root = [10,5,-3,3,2,null,11,3,-2,null,1], sum = 8

      10
     /  \
    5   -3
   / \    \
  3   2   11
 / \   \
3  -2   1

Return 3. The paths that sum to 8 are:

1.  5 -> 3
2.  5 -> 2 -> 1
3. -3 -> 11

是一个动态规划的题。由于路径顺序从上到下，所以进行先序遍历。对遍历到的结点的值域进行累加：
1. 如果累加值超过目标值，则重新进行累加继续向下遍历；
2. 如果累加值等于目标值，则找到了一个符合条件的路径；
3. 如果累加值小于目标值，则对结点值域进行累加，并继续寻找
以上的步骤一直重复递归，直到遍历的树的叶子结点。
另外还有一点要注意的是每当遍历到一个结点，就要在对原有的（一个或多个）累加的基础上，添加一个新的累加计算。这是因为路径有可能会有重复。但是我们不知道究竟有多少这样的累加（虽然遍历所有累加可以不必知道数量）


	// 首先是对每一个结点都进行遍历，其中遍历到一个结点的时候，
	// 就调用hasPathSum函数来判断在当前节点是否是符合条件路径的末尾结点，并对左右孩子进行递归
	var pathSum = function(root, sum) {
	    if (root === null) return 0;
	    return pathSum(root.left, sum) + pathSum(root.right, sum) + hasPathSum(root, 0, sum);
	};

	// 计算从每一个结点出发所能够得到的符合条件的路径，并且判断当前结点的子孙中是否有符合条件的路径
	function hasPathSum(root, prev, sum) {
	    if (root === null) return 0;
	    let now = root.val + prev;
	    let current = now === sum ? 1 : 0;
	    return current + hasPathSum(root.left, now, sum) + hasPathSum(root.right, now, sum);
	}
