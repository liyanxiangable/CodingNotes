---
title: LeetCode-习题笔记15-LongestUncommonSubsequenceI
date: 2017-08-15 10:19:22
tags:
---



Given a group of two strings, you need to find the longest uncommon subsequence of this group of two strings. The longest uncommon subsequence is defined as the longest subsequence of one of these strings and this subsequence should not be any subsequence of the other strings.

A subsequence is a sequence that can be derived from one sequence by deleting some characters without changing the order of the remaining elements. Trivially, any string is a subsequence of itself and an empty string is a subsequence of any string.

The input will be two strings, and the output needs to be the length of the longest uncommon subsequence. If the longest uncommon subsequence doesn't exist, return -1.

给出一对字符串，你需要找出这两个字符串中不公有的最长子字符串。最长不公有子字符串就是在这两个字符串中的一个子字符串，他不能是另一个字符串的子字符串，并且这个子字符串最长。返回这个最长子字符串的长度，如果最长子字符串不存在，则返回-1；




Example 1:
Input: "aba", "cdc"
Output: 3
Explanation: The longest uncommon subsequence is "aba" (or "cdc"), 
because "aba" is a subsequence of "aba", 
but not a subsequence of any other strings in the group of two strings. 
Note:

Both strings' lengths will not exceed 100.
Only letters from a ~ z will appear in input strings.


这个题没意思，因为我看讨论说：
	public int findLUSlength(String a, String b) {
	    return a.equals(b) ? -1 : Math.max(a.length(), b.length());
	}
WTF？逗我呢？难怪只有40多个赞，500多个踩。这题不写了。





参考链接：

1. [https://discuss.leetcode.com/topic/85020/java-1-liner/2](https://discuss.leetcode.com/topic/85020/java-1-liner/2)
2. 