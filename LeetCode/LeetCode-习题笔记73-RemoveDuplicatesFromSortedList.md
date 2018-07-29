---
title: LeetCode-习题笔记73-RemoveDuplicatesFromSortedList
date: 2017-08-25 20:10:50
tags:
---


Given a sorted linked list, delete all duplicates such that each element appear only once.

For example,
Given 1->1->2, return 1->2.
Given 1->1->2->3->3, return 1->2->3.

	var deleteDuplicates = function(head) {
	    if (head === null) return head;
	    let currentNode = head;
	    // 不断遍历直到最后
	    while (currentNode.next) {
	        // 判断当前的结点值域是否与下一个结点值域相等
	        if (currentNode.val === currentNode.next.val) {
	            let nextValid = currentNode.next;
	            // 判断是否之后的还是重复数字。如果是，就一直向后知道不重复
	            while (nextValid.val === currentNode.val) {
	                // 还要结尾判断
	                if (nextValid.next) {
	                    nextValid = nextValid.next;
	                } else {
	                    currentNode.next = null;
	                    break;
	                }
	            }
	            if (currentNode.next) {
	                currentNode.next = nextValid;    
	            } else {
	                break;
	            }
	        }
	        currentNode = currentNode.next;
	    }
	    return head;
	};