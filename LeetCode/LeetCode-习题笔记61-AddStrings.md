---
title: LeetCode-习题笔记61-AddStrings
date: 2017-08-23 16:26:35
tags:
---


Given two non-negative integers num1 and num2 represented as string, return the sum of num1 and num2.

Note:

The length of both num1 and num2 is < 5100.
Both num1 and num2 contains only digits 0-9.
Both num1 and num2 does not contain any leading zero.
You must not use any built-in BigInteger library or convert the inputs to integer directly.

以下代码是我一开始写的，但是js中数字为64位表示，其中有52位表示指数。所以保证的精度只有在2^-52到2^52之间。一旦在数学中算数运算超过这个范围就不能保证精度，所以以下方法不能完美的通过测试。
	var addStrings = function(num1, num2) {
	    let basic = '0'.charCodeAt();
	    let sum1 = 0, sum2 = 0;
	    let num;
	    for (let length1 = num1.length - 1; length1 >= 0; length1--) {
	        num = num1[num1.length - length1 - 1].charCodeAt() - basic;
	        sum1 += Math.pow(10, length1) * num;
	    }
	    for (let length2 = num2.length - 1; length2 >= 0; length2--) {
	        num = num2[num2.length - length2 - 1].charCodeAt() - basic;
	        sum2 += Math.pow(10, length2) * num;
	    }
	    let sum = sum1 + sum2;
	    let arr = [];
	    if (sum === 0) {
	        return '0';
	    }
	    while (sum !== 0) {
	        let remainder = sum % 10;
	        arr.unshift(String.fromCharCode(remainder + basic));
	        sum = Math.floor(sum / 10);
	    }
	    return arr.join('');
	};

将字符串中的按位进行算数运算，可以避免超出精度范围的问题。

	var addStrings = function(num1, num2) {
	    let basic = '0'.charCodeAt();
	    let result = [];
	    let numArr1 = num1.split('');
	    let numArr2 = num2.split('');
	    let sum = 0, carry = 0;
	    while (numArr1.length || numArr2.length || carry !== 0) {
	        let n1 = numArr1.length !== 0 ? numArr1.pop().charCodeAt() - basic : 0;
	        let n2 = numArr2.length !== 0 ? numArr2.pop().charCodeAt() - basic : 0;
	        sum = n1 + n2 + carry;
	        if (sum >= 10) {
	            carry = 1;
	            sum -= 10;
	        } else {
	            carry = 0;
	        }
	        result.unshift(String.fromCharCode(sum + basic));
	    }
	    return result.join('');
	};


参考链接：

1. [http://www.cnblogs.com/snandy/p/4943138.html](http://www.cnblogs.com/snandy/p/4943138.html)