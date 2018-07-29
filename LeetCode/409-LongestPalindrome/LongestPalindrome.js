/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
    let num = {};
    let len = 0;
    let single = 0;;
    for (let letter of s) {
        if (num[letter]) {
            num[letter]++;
        } else {
            num[letter] = 1;
        }
    }
    for (let key in num) {
        if (num[key] % 2 !== 1) {
            len += num[key];
        } else {
            len += num[key] - 1;
            single = 1;
        }
    }
    return len + single;
};