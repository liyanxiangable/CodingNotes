---
title: LeetCode-习题笔记10-FizzBuzz
date: 2017-08-14 09:43:03
tags:
---



Write a program that outputs the string representation of numbers from 1 to n.

But for multiples of three it should output “Fizz” instead of the number and for the multiples of five output “Buzz”. For numbers which are multiples of both three and five output “FizzBuzz”.

写一个程序输出可以代表数组1到n的字符串。但是如果位置是3的倍数那么输出Fizz，5的倍数输出Buzz。既是3的倍数优势5的倍数则输出FizzBuzz。


Example:

n = 15,

Return:
[
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz"
]


循环就好了，这题出得太简单：
	var fizzBuzz = function(n) {
	    let arr = []
	    for (let i = 0; i < n; i++) {
	        if ((i + 1) % 15 === 0) {
	            arr[i] = 'FizzBuzz';
	        } else if ((i + 1) % 5 === 0) {
	            arr[i] = 'Buzz';
	        } else if ((i + 1) % 3 === 0) {
	            arr[i] = 'Fizz';
	        } else {
	            arr[i] = '' + (i + 1);
	        }
	    }
	    return arr;
	};