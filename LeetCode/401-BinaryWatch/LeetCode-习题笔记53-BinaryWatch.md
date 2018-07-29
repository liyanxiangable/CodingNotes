---
title: LeetCode-习题笔记53-BinaryWatch
date: 2017-08-22 16:02:33
tags:
---


A binary watch has 4 LEDs on the top which represent the hours (0-11), and the 6 LEDs on the bottom represent the minutes (0-59).

Each LED represents a zero or one, with the least significant bit on the right.

![](https://upload.wikimedia.org/wikipedia/commons/8/8b/Binary_clock_samui_moon.jpg)

For example, the above binary watch  reads "3:25".

Given a non-negative integer n which represents the number of LEDs that are currently on, return all possible times the watch could represent.

Example:

Input: n = 1
Return: ["1:00", "2:00", "4:00", "8:00", "0:01", "0:02", "0:04", "0:08", "0:16", "0:32"]
Note:
The order of output does not matter.
The hour must not contain a leading zero, for example "01:00" is not valid, it should be "1:00".
The minute must be consist of two digits and may contain a leading zero, for example "10:2" is not valid, it should be "10:02".


	var readBinaryWatch = function(num) {
	    let time = [];
	    for (let h = 0; h < 12; h++) {
	        for (let m = 0; m < 60; m++) {
	        let ones = new Array(10).fill(0);
	            let hour = h, minute = m;
	            if (minute >= 32) {
	                ones[4] = 1;
	                minute -= 32;
	            }
	            if (minute >= 16) {
	                ones[5] = 1;
	                minute -= 16;
	            }
	            if (minute >= 8) {
	                ones[6] = 1;
	                minute -= 8;
	            }
	            if (minute >= 4) {
	                ones[7] = 1;
	                minute -= 4;
	            }
	            if (minute >= 2) {
	                ones[8] = 1;
	                minute -= 2;
	            }
	            if (minute >= 1) {
	                ones[9] = 1;
	                minute -=1;
	            }
	            if (hour >= 8) {
	                ones[0] = 1;
	                hour -= 8;
	            }
	            if (hour >= 4) {
	                ones[1] = 1;
	                hour -= 4;
	            }
	            if (hour >= 2) {
	                ones[2] = 1;
	                hour -= 2;
	            }
	            if (hour >= 1) {
	                ones[3] = 1;
	                hour -= 1;
	            }
	            let n = 0;
	            for (let one of ones) {
	                if (one === 1) {
	                    n++;
	                }
	            }
	            if (n === num) {
	                let string = '' + h + ':' + (m < 10 ? '0' + m : m);
	                time.push(string);
	            }
	        }
	    }
	    return time;
	};