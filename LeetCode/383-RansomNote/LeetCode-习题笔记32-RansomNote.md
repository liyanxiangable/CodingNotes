---
title: LeetCode-习题笔记32-RansomNote
date: 2017-08-20 20:36:26
tags:
---


Given an arbitrary ransom note string and another string containing letters from all the magazines, write a function that will return true if the ransom note can be constructed from the magazines ; otherwise, it will return false.

Each letter in the magazine string can only be used once in your ransom note.

Note:
You may assume that both strings contain only lowercase letters.

canConstruct("a", "b") -> false
canConstruct("aa", "ab") -> false
canConstruct("aa", "aab") -> true


	var canConstruct = function(ransomNote, magazine) {
	    let note = ransomNote.split('').sort();
	    let maga = magazine.split('').sort();
	    let index = 0, num = maga.length;
	    for (let letter of note) {
	        let found = false;
	        while (index < num) {
	            if (letter === maga[index]) {
	                found = true;
	                index++;
	                break;
	            }
	            index++;
	        }
	        if (!found) {
	            return false;
	        }
	    }
	    return true;
	};