---
title: LeetCode-习题笔记45-SameTree
date: 2017-08-21 18:45:29
tags:
---


Given two binary trees, write a function to check if they are equal or not.

Two binary trees are considered equal if they are structurally identical and the nodes have the same value.


	var isSameTree = function(p, q) {
	    if (p === null && q === null) {
	        return true;
	    }
	    if ((p === null && q !== null) || (q === null && p !== null)) {
	        return false;
	    }
	    let nodes1 = [p], nodes2 = [q];
	    while (nodes1.length && nodes2.length) {
	        let len1 = nodes1.length, len2 = nodes2.length;
	        while (len1-- && len2--) {
	            let shift1 = nodes1.shift();
	            let shift2 = nodes2.shift();
	            if (shift1.val !== shift2.val) {
	                return false;
	            }
	            let left = true, right = true;;
	            if (shift1.left) {
	                left = !left;
	                nodes1.push(shift1.left)
	            }
	            if (shift1.right) {
	                right = !right;
	                nodes1.push(shift1.right)
	            }
	            if (shift2.left) {
	                left = !left;
	                nodes2.push(shift2.left)
	            }
	            if (shift2.right) {
	                right = !right;
	                nodes2.push(shift2.right)
	            }
	            if (!left || !right) {
	                return false;
	            }
	        }
	    }
	    return true;
	};