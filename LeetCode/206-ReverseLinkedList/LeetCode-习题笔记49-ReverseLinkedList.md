---
title: LeetCode-习题笔记49-ReverseLinkedList
date: 2017-08-21 21:49:27
tags:
---


Reverse a singly linked list.


Hint:
A linked list can be reversed either iteratively or recursively. Could you implement both?


	var reverseList = function(head) {
	    if (head === null) {
	        return null;
	    }
	    let nodes = [];
	    while (head) {
	        nodes.push(head);
	        head = head.next;
	    }
	    let len = nodes.length;
	    while (len-- > 1) {
	        nodes[len].next = nodes[len - 1];
	    }
	    nodes[0].next = null;
	    return nodes[nodes.length - 1];
	};