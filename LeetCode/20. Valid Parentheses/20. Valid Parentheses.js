/**
 * Created by liyanxiang on 2017/9/9.
 */
/**
 * @param {string} s
 * @return {boolean}
 */
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
};