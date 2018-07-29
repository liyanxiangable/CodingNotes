---
title: LeetCode-习题笔记94-ImplementQueueUsingStacks
date: 2017-08-29 18:07:15
tags:
---


Implement the following operations of a queue using stacks.

push(x) -- Push element x to the back of queue.
pop() -- Removes the element from in front of queue.
peek() -- Get the front element.
empty() -- Return whether the queue is empty.
Notes:
You must use only standard operations of a stack -- which means only push to top, peek/pop from top, size, and is empty operations are valid.
Depending on your language, stack may not be supported natively. You may simulate a stack by using a list or deque (double-ended queue), as long as you use only standard operations of a stack.
You may assume that all operations are valid (for example, no pop or peek operations will be called on an empty queue).


用栈来实现队列的操作，包括：
1. 尾端进入push
2. 首端取出pop
3. 获得队首元素peek
4. 判断队列是否为空

没什么技术含量，就是别扭。。。


	/**
	 * Initialize your data structure here.
	 */
	var MyQueue = function() {
	    this.stack = [];
	};
	
	/**
	 * Push element x to the back of queue. 
	 * @param {number} x
	 * @return {void}
	 */
	MyQueue.prototype.push = function(x) {
	    this.stack[this.stack.length] = x;
	};
	
	/**
	 * Removes the element from in front of queue and returns that element.
	 * @return {number}
	 */
	MyQueue.prototype.pop = function() {
	    let p = this.stack[0];
	    if (this.stack.length === 1) {
	        this.stack = [];
	        return p;
	    }
	    let anotherStack = [];
	    for (let i = 1; i < this.stack.length; i++) {
	        anotherStack.push(this.stack[i]);
	    }
	    this.stack = [];
	    for (let item of anotherStack) {
	        this.stack.push(item);
	    }
	    return p;
	};
	
	/**
	 * Get the front element.
	 * @return {number}
	 */
	MyQueue.prototype.peek = function() {
	    let p = this.stack[0];
	    return p;
	};
	
	/**
	 * Returns whether the queue is empty.
	 * @return {boolean}
	 */
	MyQueue.prototype.empty = function() {
	    return this.stack.length === 0;
	};
	
	/** 
	 * Your MyQueue object will be instantiated and called as such:
	 * var obj = Object.create(MyQueue).createNew()
	 * obj.push(x)
	 * var param_2 = obj.pop()
	 * var param_3 = obj.peek()
	 * var param_4 = obj.empty()
	 */
