/**
 * Created by liyanxiang on 2017/8/29.
 */
/**
 * @param {number} n
 * @return {number}
 */
var trailingZeroes = function(n) {
    let zeros = 0;
    for (let i = 5; i <= n; i *= 5) {
        zeros += Math.floor(n / i);
    }
    return zeros;
};