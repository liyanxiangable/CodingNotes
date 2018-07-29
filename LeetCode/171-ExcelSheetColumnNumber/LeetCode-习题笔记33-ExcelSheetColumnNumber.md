---
title: LeetCode-习题笔记33-ExcelSheetColumnNumber
date: 2017-08-20 21:03:00
tags:
---


Related to question Excel Sheet Column Title

Given a column title as appear in an Excel sheet, return its corresponding column number.

For example:

    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 



	var titleToNumber = function(s) {
	    const basic = 'A'.charCodeAt();
	    let column = 0;
	    let power = s.length;
	    for (let i = 0; i < power; i++) {
	        column += Math.pow(26, power - i -1) * (s[i].charCodeAt() - basic + 1);
	    }
	    return column;
	};