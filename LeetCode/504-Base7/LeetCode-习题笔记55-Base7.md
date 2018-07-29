---
title: LeetCode-习题笔记55-Base7
date: 2017-08-22 19:04:26
tags:
---


Given an integer, return its base 7 string representation.

Example 1:
Input: 100
Output: "202"
Example 2:
Input: -7
Output: "-10"
Note: The input will be in range of [-1e7, 1e7].


    var convertToBase7 = function(num) {
        return num.toString(7)
    };
