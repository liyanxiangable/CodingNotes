/**
 * Created by liyanxiang on 2017/8/29.
 */
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