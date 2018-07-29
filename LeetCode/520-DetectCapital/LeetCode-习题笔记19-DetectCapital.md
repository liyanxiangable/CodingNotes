---
title: LeetCode-习题笔记19-DetectCapital
date: 2017-08-15 17:28:38
tags:
---


Given a word, you need to judge whether the usage of capitals in it is right or not.

We define the usage of capitals in a word to be right when one of the following cases holds:

All letters in this word are capitals, like "USA".
All letters in this word are not capitals, like "leetcode".
Only the first letter in this word is capital if it has more than one letter, like "Google".
Otherwise, we define that this word doesn't use capitals in a right way.
Example 1:
Input: "USA"
Output: True
Example 2:
Input: "FlaG"
Output: False
Note: The input will be a non-empty word consisting of uppercase and lowercase latin letters.

给出一个单词，你需要判断他的字母大写是否符合规则。我们规定以下情况是正确用法：
1. 单词中所有字母都是大写，比如USA
2. 所有字母都是小写，比如leetcode
3. 如果一个单词中不止一个英文字母开头大写，比如Google
否则，我们认为所有情况都是错的



// 由于昨天的时候摔了一跤，手腕跟疼。所以暂时不能打太多字了


	var detectCapitalUse = function(word) {
	    let charArray = word.split('');
	    if (isUpperCase(charArray[0])) {
	        if (charArray[1]) {
	            if (isUpperCase(charArray[1])) {
	                for (let i = 1; i < charArray.length; i++) {
	                    if (isLowerCase(charArray[i])) {
	                        return false;
	                    }
	                }
	            } else {
	                for (let i = 1; i < charArray.length; i++) {
	                    if (isUpperCase(charArray[i])) {
	                        return false;
	                    }
	                }
	            }
	        }
	    } else {
	        for (let char of charArray) {
	            if (isUpperCase(char)) {
	                return false;
	            }
	        }
	    }
	    return true;
	};
	
	function isUpperCase(char) {
	    return char === char.toUpperCase();
	}
	function isLowerCase(char) {
	    return char === char.toLowerCase();
	}


参考链接：

1. [https://segmentfault.com/q/1010000005832579](https://segmentfault.com/q/1010000005832579)
2. [https://discuss.leetcode.com/topic/91654/1-line-javascript-solution-no-regex](https://discuss.leetcode.com/topic/91654/1-line-javascript-solution-no-regex)