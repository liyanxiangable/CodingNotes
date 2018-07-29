/**
 * Created by liyanxiang on 2017/8/19.
 */
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function(a, b) {
    let m = a / b;
    return b * (m & 1);
};