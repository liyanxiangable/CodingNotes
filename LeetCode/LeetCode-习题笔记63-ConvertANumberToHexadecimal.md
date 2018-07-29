---
title: LeetCode-习题笔记63-ConvertANumberToHexadecimal
date: 2017-08-24 15:40:12
tags:
---



Given an integer, write an algorithm to convert it to hexadecimal. For negative integer, two’s complement method is used.

Note:

All letters in hexadecimal (a-f) must be in lowercase.
The hexadecimal string must not contain extra leading 0s. If the number is zero, it is represented by a single zero character '0'; otherwise, the first character in the hexadecimal string will not be the zero character.
The given number is guaranteed to fit within the range of a 32-bit signed integer.
You must not use any method provided by the library which converts/formats the number to hex directly.
Example 1:

Input:
26

Output:
"1a"
Example 2:

Input:
-1

Output:
"ffffffff"


在计算机中，负数以其正值的补码形式表达。

例如，对于数字5，他的二进制为：
	00000000 00000000 00000000 00000101
那么5的二进制的反码就是按位取反：
	11111111 11111111 11111111 11111010
最后二进制的补码就是反码加1：
	11111111 11111111 11111111 11111011
所以说-5的二进制就是以上的补码形式。转换成16进制就是：
	0X FFFF FFFB


位运算，此题先保留。