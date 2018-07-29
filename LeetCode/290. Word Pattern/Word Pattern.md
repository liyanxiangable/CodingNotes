290. Word Pattern



Given a `pattern` and a string `str`, find if `str` follows the same pattern.

Here **follow** means a full match, such that there is a bijection between a letter in `pattern` and a **non-empty** word in `str`.

**Examples:**

1. pattern = `"abba"`, str = `"dog cat cat dog"` should return true.
2. pattern = `"abba"`, str = `"dog cat cat fish"` should return false.
3. pattern = `"aaaa"`, str = `"dog cat cat dog"` should return false.
4. pattern = `"abba"`, str = `"dog dog dog dog"` should return false.

**Notes:**
You may assume `pattern` contains only lowercase letters, and `str` contains lowercase letters separated by a single space.



首先将str按照空格分开，转换成一个字符串数组。然后通过循环对pattern与字符串数组进行遍历，形成一个hash表，key就是pattern的字符，value就是字符串数组中的元素，然后再遇到相同的key的时候，当前的字符串就与value进行比对。

我一开始写成如下：

```javascript
var wordPattern = function(pattern, str) {
    let array = str.split(' ');
    let hash = {};
    let point = 0;
    while (point < array.length) {
        if (hash[pattern[point]]) {
            if (hash[pattern[point]] !== array[point]) {
                return false;
            }
        } else {
            hash[pattern[point]] = array[point];
        }
        point++;
    }
    return true;
};
```
但是有错误，原因是题目要求pattern与str一一对应，但是现在的hash并不能保证一一对应，而是可以多对一。所以我想可以利用两个hash表，实现双向的对应。如下：

```javascript
var wordPattern = function(pattern, str) {
    let array = str.split(' ');
    if (array.length !== pattern.length) return false;
    let hashPattern = {}, hashStr = {};
    let point = 0;
    while (point < array.length) {
        if (hashStr[array[point]]) {
            if (hashStr[array[point]] !== pattern[point]) {
                return false;
            }
        } else {
            hashStr[array[point]] = pattern[point];
        }
        if (hashPattern[pattern[point]]) {
            if (hashPattern[pattern[point]] !== array[point]) {
                return false;
            }
        } else {
            hashPattern[pattern[point]] = array[point];
        }
        point++;
    }
    return true;
};
```