---
title: LeetCode-习题笔记4-NumberComplement
date: 2017-08-09 21:43:12
tags:
---

Given a positive integer, output its complement number. The complement strategy is to flip the bits of its binary representation.
给出一个正整数，输出他的补数。补数就是将这个数的二进制的形式进行位运算的翻转。
注意：
给出的正整数是32位有符号整数，你可以假设给出的正整数二进制形式的前边没有开头的一串0。


Note:
The given integer is guaranteed to fit within the range of a 32-bit signed integer.
You could assume no leading zero bit in the integer’s binary representation.
Example 1:
Input: 5
Output: 2
Explanation: The binary representation of 5 is 101 (no leading zero bits), and its complement is 010. So you need to output 2.
Example 2:
Input: 1
Output: 0
Explanation: The binary representation of 1 is 1 (no leading zero bits), and its complement is 0. So you need to output 0.


我自己位运算这方面掌握的不好，虽然用其他方法做也可以，但是还是看看别人怎么写的吧：
讨论区有一种位运算的方法比较简洁。
    int findComplement(int num) {
        unsigned mask = ~0;
        while (num & mask) mask <<= 1;
        return ~mask & ~num;
    }

其中，“~”是按位取反的运算符，0的十六进制为0x00000000，那么他的取反为0xFFFFFFFF。所以这个掩码就是所有位都是1，然后让待运算的数值与这个掩码取与作为循环条件，并且掩码不断的进行左移运算。这样魂环结束之后就得到了高位全是1，低位（与二进制的待运算数值位数相等）全是0的掩码。最后按位取反掩码，按位取反待运算的数值，再将两者相与，就可以得到最终的结果。
所以：
	/**
	 * @param {number} num
	 * @return {number}
	 */
	var findComplement = function(num) {
	    var mask = ~0;
	    while (mask & num) {
	        mask <<= 1;
	    }
	    return ~mask & ~num;
	};