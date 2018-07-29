/**
 * Created by liyanxiang on 2017/9/9.
 */
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    let result = [];
    let hash = new Array(256).fill(0);
    for (let char of p) {
        hash[char.charCodeAt()]++;
    }
    let left = 0, right = 0, length = p.length;
    while (right < s.length) {
        if (hash[s[right++].charCodeAt()]-- > 0) {
            length--;
        }
        if (length === 0) {
            result.push(left);
        }
        if (right - left === p.length && hash[s[left++].charCodeAt()]++ >= 0) {
            length++;
        }
    }
    return result;
};