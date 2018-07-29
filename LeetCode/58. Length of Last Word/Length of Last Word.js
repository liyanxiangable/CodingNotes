/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
    let count = 0;
    for (let i = s.length - 1, found = false; i >= 0; i--) {
        if (s[i] === ' ') {
            if (!found) {
                continue;
            } else {
                return count;
            }
        } else {
            count++;
            found = true;
        }
    }
    return 0;
};