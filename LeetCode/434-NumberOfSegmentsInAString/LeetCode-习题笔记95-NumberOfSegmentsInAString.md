---
title: LeetCode-习题笔记95-NumberOfSegmentsInAString
date: 2017-08-29 19:32:26
tags:
---


Count the number of segments in a string, where a segment is defined to be a contiguous sequence of non-space characters.

Please note that the string does not contain any non-printable characters.

Example:

Input: "Hello, my name is John"
Output: 5


	/**
	 * @param {string} s
	 * @return {number}
	 */
	var countSegments = function(s) {
	    if (s.length === 0) {
	        return 0;
	    }
	    let num = 0;
	    let np = false;
	    for (let letter of s) {
	        if (letter !== ' ') {
	            np = true;
	        } else {
	            if (np === true) {
	                num++;
	                np = false;
	            }
	        }
	    }
	    return s[s.length - 1] === ' ' ? num : num + 1;
	};