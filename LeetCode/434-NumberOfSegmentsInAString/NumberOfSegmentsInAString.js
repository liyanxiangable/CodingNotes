/**
 * Created by liyanxiang on 2017/8/29.
 */
/**
 * @param {string} s
 * @return {number}
 */
var countSegments = function(s) {
    if (s.length === 0) {
        return 0;
    }
    let num = 0;
    let np = false;
    for (let letter of s) {
        if (letter !== ' ') {
            np = true;
        } else {
            if (np === true) {
                num++;
                np = false;
            }
        }
    }
    return s[s.length - 1] === ' ' ? num : num + 1;
};