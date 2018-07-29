---
title: LeetCode-习题笔记8-ReshapeMatrix
date: 2017-08-13 15:01:10
tags:
---


In MATLAB, there is a very useful function called 'reshape', which can reshape a matrix into a new one with different size but keep its original data.

You're given a matrix represented by a two-dimensional array, and two positive integers r and c representing the row number and column number of the wanted reshaped matrix, respectively.

The reshaped matrix need to be filled with all the elements of the original matrix in the same row-traversing order as they were.

If the 'reshape' operation with given parameters is possible and legal, output the new reshaped matrix; Otherwise, output the original matrix.


在MATLAB中，有一个名叫reshape的非常有用的函数，他可以把矩阵重新设定维数而不改变原有数据。给你一个用数组表示的二阶矩阵，还有c与r表示的想要重新设定的行数与列数两个正整数。
重新设定行列的矩阵需要在使用原有的矩阵中的元素进行填充。如果重新设定的操作给出的行列数是可行并且合法的，那么输出这个重新设定行列后的矩阵，否则输出原有矩阵。




Example 1:
Input: 
nums = 
[[1,2],
 [3,4]]
r = 1, c = 4
Output: 
[[1,2,3,4]]
Explanation:
The row-traversing of nums is [1,2,3,4]. The new reshaped matrix is a 1 * 4 matrix, fill it row by row by using the previous list.
Example 2:
Input: 
nums = 
[[1,2],
 [3,4]]
r = 2, c = 4
Output: 
[[1,2],
 [3,4]]
Explanation:
There is no way to reshape a 2 * 2 matrix to a 2 * 4 matrix. So output the original matrix.
Note:
The height and width of the given matrix is in range [1, 100].
The given r and c are all positive.

我的答案如下，但是效率不是很高：
	/**
	 * @param {number[][]} nums
	 * @param {number} r
	 * @param {number} c
	 * @return {number[][]}
	 */
	var matrixReshape = function(nums, r, c) {
	    // 首先判断参数r、c时候合理。条件就是nems矩阵的元素个数等于c * r
	    if (nums.length * nums[0].length !== r * c) {
	        return nums;
	    } else {
	        // 新矩阵
	        let newMatrix = [];
	        // 新矩阵的某一行
	        let newRow = [];
	        // 对原矩阵进行遍历
	        for (let row of nums) {
	            for (let col of row) {
	                console.log(col);
	                // 当新矩阵的某一行不满时，将旧矩阵中的元素加入这一行
	                if (newRow.length === c) {
	                    newMatrix.push(newRow);
	                    newRow = [];
	                }
	                newRow.push(col);
	            }
	        }
	        // 最后对虽然数组长度为c，但是由于循环结构不再将newRow添加到newMatrix的情况进行补充
	        if (newRow.length) {
	            newMatrix.push(newRow);
	        }
	        return newMatrix;
	    }
	};









参考链接：

1. [http://www.cnblogs.com/lodadssd/p/6236217.html](http://www.cnblogs.com/lodadssd/p/6236217.html)
2. [https://leetcode.com/problems/reshape-the-matrix/discuss/](https://leetcode.com/problems/reshape-the-matrix/discuss/)



