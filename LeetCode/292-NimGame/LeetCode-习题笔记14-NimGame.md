---
title: LeetCode-习题笔记14-292-NimGame
date: 2017-08-15 09:21:24
tags:
---


You are playing the following Nim Game with your friend: There is a heap of stones on the table, each time one of you take turns to remove 1 to 3 stones. The one who removes the last stone will be the winner. You will take the first turn to remove the stones.

Both of you are very clever and have optimal strategies for the game. Write a function to determine whether you can win the game given the number of stones in the heap.

你和你的朋友一起玩叫做Nim的游戏：在桌子上友谊罪石头，你们每一次轮流拿走1到3个石头，谁可以拿走最后一个石头获胜。游戏从你开始拿走石头。
你们两个人都很聪明，也都采取最优策略。写一份函数来确定你是否能够在给定石头数量的情况下获胜。

For example, if there are 4 stones in the heap, then you will never win the game: no matter 1, 2, or 3 stones you remove, the last stone will always be removed by your friend.

蛤蛤，与这个题类似的看谁先数到20的游戏之前听说过，当时觉得这不是20的问题，而是先数到17（一次最多两个数）。当时虽然觉得可以进行递归，但是没有多想。

现在假设有n个石头，一个人一次最多拿3个。两个人在一个回合中至少去除2个石头，当接近目标石头的差值为4的时候我能够确保抢到当前位置之后的第四个。那么如果我要赢（我拿到第n个石头），必须让另一方拿到第n-3个石头，也就是说我要拿到第n-4个石头。这样就可以进行递归了，现在的n-4又成了新的终点。一直到缩小到第m个石头（m为递归之后的），这个时候的m小于等于4，需要分情况讨论了，因为是我先手，所以如果m是[1,3]，那我肯定抢得到，如果m=4，那么我就输了。

所以仅对于这个题而言，代码如下：
	var canWinNim = function(n) {
	    return Boolean(n % 4);
	};
其中如果游戏规则改为一次可以拿x个，则可以将4改为x+1。我很好奇为什么效率还是不高。。。。

参考链接：
[https://leetcode.com/problems/nim-game/discuss/](https://leetcode.com/problems/nim-game/discuss/)