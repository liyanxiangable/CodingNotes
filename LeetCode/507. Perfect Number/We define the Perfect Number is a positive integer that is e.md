We define the Perfect Number is a **positive** integer that is equal to the sum of all its **positive** divisors except itself.

Now, given an integer n, write a function that returns true when it is a perfect number and false when it is not.

**Example:**

```
Input: 28
Output: True
Explanation: 28 = 1 + 2 + 4 + 7 + 14

```

**Note:** The input number **n** will not exceed 100,000,000. (1e8)

首先要求得这个数的所有的因数。我觉得这个题没什么算法可言。顶多就是缩小一下遍历因数的范围。我的解答如下：

```javascript
var checkPerfectNumber = function(num) {
    if (num === 1) {
        return false;
    }
    sum = 0;
    let lastDivisor = num;
    for (let i = 1; i <= lastDivisor; i++) {
        if (num % i === 0) {
            if (lastDivisor === num) {
                lastDivisor = num / i;
            }
            sum += i;
        }
    }
    return sum === num;
};	
```
然后将区间逐步缩小：

```javascript
var checkPerfectNumber = function(num) {
    if (num === 1) {
        return false;
    }
    sum = 1;
    let lastDivisor = num;
    for (let i = 2; i < Math.sqrt(num, 0.5); i++) {
        if (num % i === 0) {
            lastDivisor = num / i;
            sum += i + lastDivisor;
        }
    }
    return sum === num;
};
```
OK了。我看别人的算法，呵呵了：

[参考链接](https://discuss.leetcode.com/topic/84264/2-line-solution-c/3)