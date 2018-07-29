Given a string containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

The brackets must close in the correct order, `"()"` and `"()[]{}"` are all valid but `"(]"` and `"([)]"` are not.



我想使用两个指针，一前一后，如果一端的指针指向的字符与其相邻的字符不是一对，那么就有两种情况。一是这个字符串不是正确的顺序；二是括号的另一半在另一端的某个位置。所以可以对字符串进行循环或者是递归的检查。

不过我不太想这么做，因为复杂度比较高并且边界条件太多。我想另一种方法是使用栈或者队列等数据结构，在正确使用括号的情况下，括号都是以小字符串为单位对称成对出现的。利用这个性质来进行判断在时间复杂度上较为简单。



昨天写了一晚上，总是有各种的错误，乱七八糟的写了一大堆还打各种补丁。后来仔细想了想，就是主要矛盾没有清楚。虽然也知道要怎么做，但总是模模糊糊的。今天中午想了想，其实就是使用一个栈，不断将当前遍历到的元素与栈顶元素相比对，没什么其他的。而栈是从一端进行进出的操作，所以使用push与pop，或者是shift与unshift这两组方法。如下：

```javascript
var isValid = function(s) {
    let leftBrackets = [], rightBrackets = [];
    let len = 0;
    let leftOrRight = true;
    for (let char of s) {
        // 如果是左侧的三种括号，就将对应的括号入栈
        if (char === '(' || char === '[' ||char === '{') {
            leftBrackets.push(char);
        }

        // 如果遍历到了右侧括号，那么就对之前的左侧括号与接下来的右侧括号进行比对
        if (char === ')' || char === ']' || char === '}') {
            let topStackChar = leftBrackets.pop();
            if (typeof topStackChar === 'undefined') {
                return false;
            }
            if (topStackChar === '(' && char !== ')') {
                return false;
            } else if (topStackChar === '[' && char !== ']') {
                return false;
            } else if (topStackChar === '{' && char !== '}') {
                return false;
            }
        }
    }
    return leftBrackets.length === 0;
```