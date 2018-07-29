---
title: LeetCode-习题笔记46-ValidAnagram
date: 2017-08-21 19:58:00
tags:
---



Given two strings s and t, write a function to determine if t is an anagram of s.

For example,
s = "anagram", t = "nagaram", return true.
s = "rat", t = "car", return false.

Note:
You may assume the string contains only lowercase alphabets.

Follow up:
What if the inputs contain unicode characters? How would you adapt your solution to such case?


	var isAnagram = function(s, t) {
	    return s.split('').sort().join('') === t.split('').sort().join('');
	};