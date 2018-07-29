---
title: LeetCode-习题笔记58-ReverseStringII
date: 2017-08-22 21:12:07
tags:
---


Given a string and an integer k, you need to reverse the first k characters for every 2k characters counting from the start of the string. If there are less than k characters left, reverse all of them. If there are less than 2k but greater than or equal to k characters, then reverse the first k characters and left the other as original.
Example:
Input: s = "abcdefg", k = 2
Output: "bacdfeg"
Restrictions:
The string consists of lower English letters only.
Length of the given string and k will in the range [1, 10000]

	
	/**
	 * @param {string} s
	 * @param {number} k
	 * @return {string}
	 */
	var reverseStr = function(s, k) {
	    let arr = [];
	    let end = 0, start;
	    while (s.length > end) {
	        start = end;
	        end += k;
	        arr.push(s.slice(start, end));
	    }
	    let string = '';
	    for (let i = 0; i < arr.length; i++) {
	        if (i % 2 === 0) {
	            arr[i] = arr[i].split('').reverse().join('');
	        }
	        string += arr[i];
	    }
	    return string;
	};