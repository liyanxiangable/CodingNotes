/**
 * Created by liyanxiang on 2017/8/21.
 */
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
    for (let letter of s) {
        if (s.indexOf(letter) === s.lastIndexOf(letter)) {
            return s.indexOf(letter);
        }
    }
    return -1;
};