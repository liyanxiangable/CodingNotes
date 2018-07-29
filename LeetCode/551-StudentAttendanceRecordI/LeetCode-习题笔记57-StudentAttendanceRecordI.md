---
title: LeetCode-习题笔记57-StudentAttendanceRecordI
date: 2017-08-22 20:59:44
tags:
---


You are given a string representing an attendance record for a student. The record only contains the following three characters:

'A' : Absent.
'L' : Late.
'P' : Present.
A student could be rewarded if his attendance record doesn't contain more than one 'A' (absent) or more than two continuous 'L' (late).

You need to return whether the student could be rewarded according to his attendance record.

Example 1:
Input: "PPALLP"
Output: True
Example 2:
Input: "PPALLL"
Output: False

	var checkRecord = function(s) {
	    let A = 0, L = 0;
	    for (let letter of s) {
	        if (letter === 'A') {
	            A++;
	            if (A === 2) {
	                return false;
	            }
	        }
	        if (letter === 'L') {
	            L++;
	            if (L === 3) {
	                return false;
	            }
	        } else {
	            L = 0;
	        }
	    }
	    return true;
	}


	var checkRecord = function(s) {
	    return s.indexOf('LLL') === -1 && s.indexOf('A') === s.lastIndexOf('A');
	};