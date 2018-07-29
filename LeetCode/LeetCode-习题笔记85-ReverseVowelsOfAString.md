---
title: LeetCode-习题笔记85-ReverseVowelsOfAString
date: 2017-08-28 17:09:50
tags:
---


Write a function that takes a string as input and reverse only the vowels of a string.

Example 1:
Given s = "hello", return "holle".

Example 2:
Given s = "leetcode", return "leotcede".

Note:
The vowels does not include the letter "y".

我想就是从两头向中间进行遍历，当两边都新找到一个元音字母的时候，进行交换，所以说可能需要多个辅助的变量。现在有个问题就是js中字符串不允许通过索引修改对应位置的字符。所以要下转换成数组，最后再合并成字符串。
最后还有个坑就是大小写，我一开始值考虑了小写。。。。

	var reverseVowels = function(s) {
	    let left = null, right = null;
	    let vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
	    let begin = 0, end = s.length - 1;
	    s = s.split('');
	    while (begin < end) {
	        if (left || vowels.has(s[begin])) {
	            left = s[begin];
	        } else {
	            begin++;
	        }
	        if (right || vowels.has(s[end])) {
	            right = s[end];
	        } else {
	            end--;
	        }
	        if (left && right) {
	            let temp = s[begin];
	            s[begin] = s[end];
	            s[end] = temp;
	            left = right = null;
	            end--;
	            begin++;
	        }
	    }
	    return s.join('');
	};


当然可以不用以上left与right的辅助变量，只是这样效率会提高一些：

	var reverseVowels = function(s) {
	    let vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
	    let begin = 0, end = s.length - 1;
	    s = s.split('');
	    while (begin < end) {
	        if (!vowels.has(s[begin])) {
	            begin++;
	        }
	        if (!vowels.has(s[end])) {
	            end--;
	        }
	        if (vowels.has(s[begin]) && vowels.has(s[end])) {
	            let temp = s[begin];
	            s[begin] = s[end];
	            s[end] = temp;
	            end--;
	            begin++;
	        }
	    }
	    return s.join('');
	};