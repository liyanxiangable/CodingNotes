/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {
    if (n <= 0) return false;
    let temp = Math.log10(n) / Math.log10(3);
    return temp === Math.floor(temp)
};