---
title: LeetCode 习题笔记1 HammingDistance
date: 2017-07-25 10:34:32
tags:
---

The Hamming distance between two integers is the number of positions at which the corresponding bits are different.
Given two integers x and y, calculate the Hamming distance.
Note: 0 ≤ x, y < 2（31）.
两个整数的汉明距离是（2进制中）不同的位的数目
计算两个数X、Y之间的汉明距离，（X、Y大于等于0，小于2的31次方）

Example:
    Input: x = 1, y = 4
    Output: 2

Explanation:
    1   (0 0 0 1)
    4   (0 1 0 0)
           ？  ？
The above arrows point to positions where the corresponding bits are different.

这个汉明运算比较不同的位，首先想到的就是异或。异或是将两个数的二进制的不同的为置1，相同位置为0。现在两个数X, Y进行了异或运算之后，得到的结果设为Z。想要得到Z的二进制中1的个数，这就是汉明距离。那么怎么得到1的个数呢，我想的是将Z拆分成若干的2的整数次幂。例如Z = 11 = 8 + 2 + 1 = 2^3 + 2^1 + 2^0。这样能分解成3个2的整数次幂，就表明汉明距离为3。或者是进行左移（右移）位运算，或者是进行模运算等。我这里使用模运算。
注意到js是若类型语言，所以如果把他当作C语言等强类型语言一样，以为Z/2永远是整数的话，就会出现错误。所以应当使用Math类或者其他方法来保持Z是一个整数。
可以分为两种情况，一是Z为偶数，此时Z可以直接进行除以2的运算。
二是Z为奇数，这个时候减去1，再进行除以2的运算。
代码如下：
	var x, y, z, distance = 0;
	x = 1;
	y = 4;
	z = x ^ y;
	
	while (z > 0) {
	    if (z % 2 === 1) {
	        z -= 1;
	        distance++;
	    }
	    z /= 2;
	}
	console.log(distance);

封装成函数：
	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {number}
	 */
	var hammingDistance = function(x, y) {
	    var z, distance = 0;
	    z = x ^ y;
	    while (z > 0) {
	        if (z % 2 === 1) {
	            z -= 1;
	            distance++;
	        }
	        z /= 2;
	    }
	    return distance;
	};
leetcode显示用时109ms。





参考链接：

1. [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
2. 