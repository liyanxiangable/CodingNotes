/**
 * Created by liyanxiang on 2017/9/6.
 */
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    for (let i = 0; i < Math.ceil(x.toString().length / 2); i++) {
        if (x.toString()[i] !== x.toString()[x.toString().length - 1 - i]) {
            return false;
        }
    }
    return true;
};