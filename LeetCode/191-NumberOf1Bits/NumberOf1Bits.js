/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
    let count = 0;
    while (n) {
        count += n & 1;
        n = n >>> 1;
    }
    return count;
};