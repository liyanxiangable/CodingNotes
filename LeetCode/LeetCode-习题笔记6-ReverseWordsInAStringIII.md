---
title: LeetCode-习题笔记6-BigCountries
date: 2017-08-13 09:50:22
tags:
---


Given a string, you need to reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.

给出一个字符串，你需要将句子中每一个单词中的字母顺序反转，同时保持空格与开始时的单词顺序。
注意：在一个字符串中，各个单子是使用单个空格键相分隔的，字符串中也不会有多于的空白字符。

Example 1:
Input: "Let's take LeetCode contest"
Output: "s'teL ekat edoCteeL tsetnoc"
Note: In the string, each word is separated by single space and there will not be any extra space in the string.

js来写这道题的话，应当比较简单。
1. 先把这个字符串转为数组
2. 然后以空格分隔成多个小的数组
3. 小数组内部进行反转
4. 进行数组（或者字符串）的拼接

	/**
	 * @param {string} s
	 * @return {string}
	 */
	var reverseWords = function(s) {
	    // 首先进行字符串以空格分隔转为若干小字符串
	    let arrs = s.split(' ');
	    console.log(arrs);
	    let sentence = [];
	    // 遍历每个单词
	    for (let arr of arrs) {
	        // 单词现在为字符串格式，需要将他先转换为数组格式，才能调用reverse方法
	        arr = arr.split('').reverse();
	        // 然后需要将数组转为字符串，使用join函数，单词变为字符串之后加入数组
	        let word = arr.join('');
	        sentence.push(word);
	        console.log(arr);
	    }
	    // 最后将总的数组以空格字符合并成字符串
	    return sentence.join(' ').toString();
	};
	reverseWords("hello, gakki! I'm lyx");