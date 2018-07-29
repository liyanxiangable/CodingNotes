438. ​
439. Find All Anagrams in a String

Given a string **s** and a **non-empty** string **p**, find all the start indices of **p**'s anagrams in **s**.

Strings consists of lowercase English letters only and the length of both strings **s** and **p** will not be larger than 20,100.

The order of output does not matter.

**Example 1:**

```
Input:
s: "cbaebabacd" p: "abc"

Output:
[0, 6]

Explanation:
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".
```

**Example 2:**

```
Input:
s: "abab" p: "ab"

Output:
[0, 1, 2]

Explanation:
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".
```



这是典型的动态规划的题目，我的想法是假设p的长度为len，那么就从s开始遍历，一次连续取len个字符，判断这len个字符是否是p的anagram单词。

关键在于对于怎么判断这len个字符是p的重新排列，我想的是利用array.remove等方法来对数组进行操作，但是这样的复杂太高。另外还可以创建set等数据结构，比较两个set，set并不好比较。由于对于s的遍历是一个一个字符进行的，对于长度为len的字符串，每次变化的只有一个字符，另外的1到len - 1（索引从0开始）个字符是不变的所以我想把数组分成两个部分。

后来看了一下，这种问题有个专门的算法，叫做sliding window（滑动窗口算法）。

[sliding window algorithm](https://stackoverflow.com/questions/8269916/what-is-sliding-window-algorithm-examples)

这种滑动窗口算法设定两个指针left与right指向窗口的左右两个边界，设定窗口的宽度为p字符串的长度。利用一个将字符的ascii码值作为索引的数组statistics来储存相对应的字符出现的个数，那么这个数组就可以实现一个hash表，key就是字符，value就是字符出现的次数。然后首先对p字符串进行遍历，得到一个参照标准的hash表。然后就可以对s字符串进行遍历，遍历的边界条件就是窗口右侧指针不能超过s的范围。需要注意一点的是虽然left与right为左右两个边界，但是他们应当初始化为0才可以正常进行遍历，因为首先要对长度为p.length的字符串进行处理。首先right不断右移，一直处理了p.length个的时候，left与right一直右移。

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
  	// 返回索引数组
    let result = [];
  	// 创建一个hash表，用0值填充。
  	// 长度为256的原因是因为ascii码有256个，所以其实可以缩小范围到小写字母26个
    let hash = new Array(256).fill(0);
  	// 对p字符串进行遍历，把字符的ascii码作为索引，将对应的字符出现的次数进行存储
    for (let char of p) {
        hash[char.charCodeAt()]++;
    }
  	// 初始化左边界与右边界，初始化长度以便判断
    let left = 0, right = 0, length = p.length;
    while (right < s.length) {
      	// 以下的代码写得比较“浓缩”，一句句解释
      	// 整体上是通过length长度的大小来判断窗口内的字符串是否是anagram
      	// 首先右边界右移，判断当前的右边界字符是否在p字符串中，如果在，那么length自减。当length减到0的时候，说明宽度为length的窗口中的字符串符合要求。
      	// 如果窗口的宽度为p的长度，左边界的字符的次数非负，那么就说明左边界的字符也在p字符串中。这一点一开始有些疑惑，因为次数为什么会非负呢？原因就是right沿着遍历的方向是在left之前的，而我们的right有一个副作用是将次数进行自减了。
      
      	// 首先，right为右边界，那么s[right]就是但钱窗口的右边界的字符
      	// hash[当前右边界字符取ascii码作为索引]就是获得右边界字符的出现次数
      	// 同时这一行代码有两个副作用，right++右边界右移，hash[]--次数自减
      	// 注意这里的自加与自减运算都是后缀运算，所以是取的当前的右边界字符与当前字符的出现次数，然后右边界右移；先与0比较大小在进行的自减运算
      	// 现在如果次数是大于0的，那说明右边界当前的字符在p字符串中出现过
        if (hash[s[right++].charCodeAt()]-- > 0) {
            length--;
        }
        if (length === 0) {
            result.push(left);
        }
      	// 当达到了标准的窗口宽度并且左边界的字符次数非负，那么表示左边界的字符在p中，此时对length进行自加补偿。为什么要达到标准的宽度呢？是因为此时left才可以向右移动
        if (right - left === p.length && hash[s[left++].charCodeAt()]++ >= 0) {
            length++;
        }
    }
    return result;
};
```

这个算法还是没有完全明白，标记下以后请教一下。