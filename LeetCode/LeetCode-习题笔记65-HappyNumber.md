---
title: LeetCode-习题笔记65-HappyNumber
date: 2017-08-24 19:10:27
tags:
---


Write an algorithm to determine if a number is "happy".

A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy numbers.

Example: 19 is a happy number

1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1


这个题很有意思，不管是使用递归也好，还是循环也好。总要有个出口，但是现在就是判断的是否能够各位数平方之和等于1。所以不能够使用这个条件来作为出口，否则会陷入死循环。
那么就思考怎样的数不能够Happy。对于一个任意大的正整数，经过上述的运算之后会变成各个位的平方的和，最终会得到一个较小的数，具体是多少我没有算，但是假设他是两位数的话，不会超过99，这样继续运算得到的数又会得到162，继续下去的所有步骤中，不会再大于162这个上限。所以要么能够符合条件，要么不能，不能的时候就进入了无限的循环，此时会出现重复的值。一旦有重复的值，就说明不是happy数字。
	
	var isHappy = function(n) {
	    let set = new Set();
	    function judge(m) {
	        let nums = m.toString().split('');
	        sum = 0;
	        for (let num of nums) {
	            sum += Math.pow(Number(num), 2);
	        }
	        if (sum === 1) {
	            return true;
	        }
	        if (set.has(sum)) {
	            return false;
	        } else {
	            set.add(sum);
	            return judge(sum);
	        }        
	    }
	    return judge(n);
	};