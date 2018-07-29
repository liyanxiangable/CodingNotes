/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    if (n <= 0) {
        return false;
    }
    // 当n为2的x次幂的时候，其二进制首位为1，其余位为0
    // 此时n-1所有位均为1，两者相与，所有位为1，最后取非为0
    return !(n & (n - 1));
};