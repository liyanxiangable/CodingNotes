---
title: LeetCode习题笔记-KeyboardRow
date: 2017-08-12 10:00:37
tags:
---


Given a List of words, return the words that can be typed using letters of alphabet on only one row's of American keyboard like the image below.
给出一组单词，返回那些能够使用美式键盘（如下图）中的一行的字母打印的单词。
![](https://leetcode.com/static/images/problemset/keyboard.png)

Example 1:
Input: ["Hello", "Alaska", "Dad", "Peace"]
Output: ["Alaska", "Dad"]
Note:
You may use one character in the keyboard more than once.
You may assume the input string will only contain letters of alphabet.

例如，输入["Hello", "Alaska", "Dad", "Peace"]，返回["Alaska", "Dad"]。
注意你可以多次使用同一个字母，可以假定输入的字符串只包含英文字母。
	
键盘一共三行字母，首先想到最简单（逻辑上）的方法是拿每一个单词的每一个字母与键盘每一行的每一个字母比对。然后是否可以优化？
想到单词中有重复的字母，这个可以将重复字母去掉，因为不影响结果。这样虽然省下了重复的字母与键盘的比较，但是缺点就是要增加字母内部的比较。
另外一点就是键盘三行的长度不一致，第一行最长，第二行次之，第三行最短。这样可以先比较最后一行，再比较中间行，最后是上边的第一行。
然后既然单词中全部都是英文字母，也就是说跑不出这三行字母，因此如果比较了两行都没有相应字母的话，那么单词中的字母就一定都是在第三行中。


	/**
	 * Created by liyanxiang on 2017/8/12.
	 */
	/**
	 * @param {string[]} words
	 * @return {string[]}
	 */
	var findWords = function(words) {
	    // 初始化键盘字母数组
	    let upper = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
	    let lower = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
	    let middle = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
	    let keyboard = [lower, middle, upper];
	
	    // 初始化返回的字符串数组
	    let foundWords = [];
	
	    // 遍历所有输入字符串
	    for (let word of words) {
	        // 将单词格式化并转换成字母数组
	        let letters = word.toLowerCase().split('');
	        // 对字符串进行字母的去重
	        let tidyWord = eliminateDuplication(letters);
	        // 判断第一个字母的辅助变量
	        let isFirstLetter = true;
	        // 设定层数标志位，默认为上边的一层，即索引为2的层。
	        let index = 2;
	        // 设置是否符合输出要求的标志位
	        let fitable = true;
	        // 对每个字符进行遍历
	        for (let wordLetter of tidyWord) {
	            // 设定判断单词中字母是在键盘某行的标志位
	            let inRow = false;
	            // 首先判断单词首字母在第几层
	            // 设置标志位，标志位表示每一个单词的第一个字母所在的行
	            // 标志位仅在遍历第一个字母的时候设置，所以引入isFirstLetter
	            if (isFirstLetter) {
	                // 对键盘的每一行（除字母最多的一行外）进行遍历
	                for (let i = 0; i < keyboard.length; i++) {
	                    // 对其中一行的所有字母进行遍历
	                    for (let rowLetter of keyboard[i]) {
	                        // 如果两个字母相同，那么就判断出了层数，否则层数为默认的最上层
	                        if (rowLetter === wordLetter) {
	                            index = i;
	                            break;
	                        }
	                    }
	                    if (index !== 2) {
	                        break;
	                    }
	                }
	            }
	            // 选出首字母在第几行之后，对此行的字母进行遍历
	            for (let keyboardLetter of keyboard[index]) {
	                // 如果之后的字母不在这一行的字母之中，则可以判断不符合输出要求
	                // 当进行完遍历之后，如果inRow仍然是false，就说明字母不在此行
	                if (keyboardLetter === wordLetter) {
	                    inRow = true;
	                }
	            }
	            if (inRow === false) {
	                // 如果inRow为false，那么不符合要求，输出标志位置为false
	                fitable = false;
	                break;
	            }
	            isFirstLetter = false;
	        }
	        // 如果符合要求，则添加到输出数组
	        if (fitable) {
	            foundWords.push(word);
	        }
	    }
	
	    return foundWords;
	};
	
	var eliminateDuplication = function(word) {
	    // 实现字母去重
	    let tidyWord = [];
	    for (let letter of word) {
	        if (!(letter in tidyWord)) {
	            tidyWord.push(letter);
	        }
	    }
	    return tidyWord;
	};