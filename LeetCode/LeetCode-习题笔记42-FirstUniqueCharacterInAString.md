---
title: LeetCode-习题笔记42-FirstUniqueCharacterInAString
date: 2017-08-21 16:39:33
tags:
---


Given a string, find the first non-repeating character in it and return it's index. If it doesn't exist, return -1.

Examples:

s = "leetcode"
return 0.

s = "loveleetcode",
return 2.
Note: You may assume the string contain only lowercase letters.


	var firstUniqChar = function(s) {
	    for (let letter of s) {
	        if (s.indexOf(letter) === s.lastIndexOf(letter)) {
	            return s.indexOf(letter);
	        }
	    }
	    return -1;
	};

