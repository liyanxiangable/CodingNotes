---
title: LeetCode-习题笔记79-MergeTwoSortedLists
date: 2017-08-25 23:32:19
tags:
---


Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.

要形成一个按升序排列好的链表：
我使用递归方法，首先创建一个结点，然后不断创建后继结点。直到某一个链表遍历到最后的元素。

	var mergeTwoLists = function(l1, l2) {
	    if (l1 === null) {
	        return l2;
	    }
	    if (l2 === null) {
	        return l1;
	    }
	    let newList = new ListNode();
	    if (l1.val > l2.val) {
	        newList.val = l2.val;
	        newList.next = mergeTwoLists(l1, l2.next);        
	    } else {
	        newList.val = l1.val;
	        newList.next = mergeTwoLists(l1.next, l2);        
	    }
	    return newList;
	};
