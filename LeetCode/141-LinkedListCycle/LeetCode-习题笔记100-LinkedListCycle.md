---
title: LeetCode-习题笔记100-LinkedListCycle
date: 2017-08-29 22:45:14
tags:
---


Given a linked list, determine if it has a cycle in it.

Follow up:
Can you solve it without using extra space?


判断有没有内回路，可以对整个链表进行遍历。并利用hashmap进行对结点的储存，如果判断到遍历有重复的结点，那么就有内回路。


	/**
	 * Definition for singly-linked list.
	 * function ListNode(val) {
	 *     this.val = val;
	 *     this.next = null;
	 * }
	 */
	
	/**
	 * @param {ListNode} head
	 * @return {boolean}
	 */
	var hasCycle = function(head) {
	    let set = new Set();
	    while (head) {
	        if (set.has(head)) {
	            return true;
	        } else {
	            set.add(head);
	        }
	        head = head.next;
	    }
	    return false;
	};

这种方法用了集合，时间复杂度与空间复杂度都较高，我看到讨论区给出了一种空间复杂度O(1)的方法。就是用两个指针，一个walker一个runner。walker一次走一个结点，runner一次走两个结点，这样的话如果没有内回路，就直接遍历完了。如果有内回路，那么runner会一直在回路中循环，最终walker也遍历到回路部分，他们两个总会相遇。一旦相遇，就说明有内回路。


	var hasCycle = function(head) {
	    if (head === null) {
	        return false;
	    }
	    let walker = runner = head;
	    while (walker.next && runner.next && runner.next.next) {
	        walker = walker.next;
	        runner = runner.next.next;
	        if (walker === runner) {
	            return true;
	        }
	    }
	    return false;
	};

这种方法要注意的一点就是，检查循环条件是否可以继续往下进行。我一开始写的是

	while (walker.next && runner.next.next)

看起来没什么错误，walker一次移动一个结点，runner一次移动两个结点。但是runner移动两个结点是在移动一个结点的基础之上的。所以还要检查runner.next。