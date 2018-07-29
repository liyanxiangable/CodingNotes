/**
 * Initialize your data structure here.
 */
/**
 * Initialize your data structure here.
 */
var MyStack = function() {
    this.stack = [];
    this.stack.length = 0;
};

/**
 * Push element x onto stack.
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    // 要实现栈的push，就是在栈顶添加与删除元素。我们规定队列的队首当作栈底；队尾当作栈顶
    // 又因为队列是从队尾进，队首出。所以栈的push就是队列添加队尾元素
    this.stack[this.stack.length] = x;
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function() {
    return this.stack.pop();
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.stack.length === 0;
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = Object.create(MyStack).createNew()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */