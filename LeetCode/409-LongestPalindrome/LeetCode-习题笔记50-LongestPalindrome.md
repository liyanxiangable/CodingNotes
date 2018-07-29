---
title: LeetCode-习题笔记50-LongestPalindrome
date: 2017-08-22 10:05:19
tags:
---



Given a string which consists of lowercase or uppercase letters, find the length of the longest palindromes that can be built with those letters.

This is case sensitive, for example "Aa" is not considered a palindrome here.

Note:
Assume the length of given string will not exceed 1,010.

Example:

Input:
"abccccdd"

Output:
7

Explanation:
One longest palindrome that can be built is "dccaccd", whose length is 7.


	var longestPalindrome = function(s) {
	    let num = {};
	    let len = 0;
	    let single = 0;;
	    for (let letter of s) {
	        if (num[letter]) {
	            num[letter]++;
	        } else {
	            num[letter] = 1;
	        }
	    }
	    for (let key in num) {
	        if (num[key] % 2 !== 1) {
	            len += num[key];
	        } else {
	            len += num[key] - 1;
	            single = 1;
	        }
	    }
	    return len + single;
	};