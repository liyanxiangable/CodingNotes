/**
 * Created by liyanxiang on 2017/9/14.
 */
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    for (let i = 0; i < haystack.length; i++) {
        if (haystack[i] === needle[0]) {
            let j = 0;
            for (; j < needle; j++) {
                if (needle[j] !== haystack[j + i]) {
                    break;
                }
            }
            if (j === needle.length) {
                return i;
            }
        }
    }
    return -1;
};