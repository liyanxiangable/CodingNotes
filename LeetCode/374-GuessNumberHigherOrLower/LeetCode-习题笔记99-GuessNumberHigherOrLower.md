---
title: LeetCode-习题笔记99-GuessNumberHigherOrLower
date: 2017-08-29 21:35:10
tags:
---


We are playing the Guess Game. The game is as follows:

I pick a number from 1 to n. You have to guess which number I picked.

Every time you guess wrong, I'll tell you whether the number is higher or lower.

You call a pre-defined API guess(int num) which returns 3 possible results (-1, 1, or 0):

-1 : My number is lower
 1 : My number is higher
 0 : Congrats! You got it!
Example:
n = 10, I pick 6.

Return 6.


	// Forward declaration of guess API.
	// @param num, your guess
	// @return -1 if my number is lower, 1 if my number is higher, otherwise return 0
	int guess(int num);
	
	class Solution {
	public:
	    int guessNumber(int n) {
	        int begin = 1;
	        int end = n;
	        int number;
	        while (begin <= end) {
	            number = begin + ((end - begin) >> 2);
	            int answer = guess(number);
	            if (answer == -1) {
	                end = number - 1;
	            } else if (answer == 1) {
	                begin = number + 1;
	            } else if (answer == 0) {
	                return number;
	            }
	        }
	        return number;
	    }
	};



参考链接：

1. [https://discuss.leetcode.com/topic/74825/what-is-the-difference-between-low-high-2-and-low-high-low-2](https://discuss.leetcode.com/topic/74825/what-is-the-difference-between-low-high-2-and-low-high-low-2)