---
title: LeetCode-习题笔记90-RepeatedSubstringPattern
date: 2017-08-28 21:42:27
tags:
---


Given a non-empty string check if it can be constructed by taking a substring of it and appending multiple copies of the substring together. You may assume the given string consists of lowercase English letters only and its length will not exceed 10000.

Example 1:
Input: "abab"

Output: True

Explanation: It's the substring "ab" twice.
Example 2:
Input: "aba"

Output: False
Example 3:
Input: "abcabcabcabc"

Output: True

Explanation: It's the substring "abc" four times. (And the substring "abcabc" twice.)


首先，由于字符串周期循环，所以一个小字符串单位开头是整个字符串的开头，结尾是整个字符串的结尾。那么从头寻找出现的最后一个字符串，找到之后判断以开头到第一次出现的小字符串是否符合要求，若不符合，再向下寻找，直到找到总字符串一半的长度。

以下是我的答案，没有通过

	/**
	 * @param {string} s
	 * @return {boolean}
	 */
	var repeatedSubstringPattern = function(s) {
	    if (s.length === 2) {
	        return s[0] === s[1];
	    }
	    let lastLetter = s[s.length - 1];
	    let occurrence = 0;
	    let assumeStr;
	    while (assumeStr !== s) {
	        assumeStr = '';
	        occurrence = findNextOccurrence(s, occurrence, lastLetter);
	        if (occurrence === -1) {
	            return false;
	        }
	        if (s.length % (occurrence + 1) !== 0) {
	            continue;
	        }
	        let times = s.length / (occurrence + 1);
	        while (times--) {
	            assumeStr += s.substring(0, occurrence + 1);
	        }
	        if (assumeStr === s) {
	            return true;
	        }
	    }
	};
	
	function findNextOccurrence(s, occurrence, lastLetter) {
	    for (let i = occurrence + 1; i <= Math.floor(s.length / 2); i++) {
	        if (s[i] === lastLetter) {
	            return i;
	        }
	    }
	    return -1;
	};

好烦，明天再做。

修改后通过：

	var repeatedSubstringPattern = function(s) {
	    if (s.length <= 1) {
	        return false;
	    }
	    let lastLetter = s[s.length - 1];
	    let occurrence = -1;
	    let assumeStr;
	    while (assumeStr !== s) {
	        occurrence++;
	        assumeStr = '';
	        occurrence = findNextOccurrence(s, occurrence, lastLetter);
	        if (occurrence === -1) {
	            return false;
	        }
	        if (s.length % (occurrence + 1) !== 0) {
	            continue;
	        }
	        let times = s.length / (occurrence + 1);
	        while (times--) {
	            assumeStr += s.substring(0, occurrence + 1);
	        }
	        if (assumeStr === s) {
	            return true;
	        } 
	    }
	};
	
	function findNextOccurrence(s, occurrence, lastLetter) {
	    for (let i = occurrence; i < Math.floor(s.length / 2); i++) {
	        if (s[i] === lastLetter) {
	            return i;
	        }
	    }
	    return -1;
	};