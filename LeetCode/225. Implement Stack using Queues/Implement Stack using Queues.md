225. Implement Stack using Queues



Implement the following operations of a stack using queues.

- push(x) -- Push element x onto stack.
- pop() -- Removes the element on top of the stack.
- top() -- Get the top element.
- empty() -- Return whether the stack is empty.

Notes:

- You must use *only* standard operations of a queue -- which means only `push to back`, `peek/pop from front`, `size`, and `is empty` operations are valid.
- Depending on your language, queue may not be supported natively. You may simulate a queue by using a list or deque (double-ended queue), as long as you use only standard operations of a queue.
- You may assume that all operations are valid (for example, no pop or top operations will be called on an empty stack).



使用队列来实现栈，包括push，pop，top，empty操作。这个题之前做过一个类似的，比较简单。队列操作是能使用push，pop，peep，size，isEmpty等方法。



```javascript
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
```


