---
title: LeetCode-习题笔记44-DeleteNodeInALinkedList
date: 2017-08-21 17:40:40
tags:
---


Write a function to delete a node (except the tail) in a singly linked list, given only access to that node.

Supposed the linked list is 1 -> 2 -> 3 -> 4 and you are given the third node with value 3, the linked list should become 1 -> 2 -> 4 after calling your function.

    var deleteNode = function(node) {
        node.val = node.next.val;
        node.next = node.next.next;
    };
