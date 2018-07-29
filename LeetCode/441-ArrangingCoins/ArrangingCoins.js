/**
 * Created by liyanxiang on 2017/8/29.
 */
/**
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function(n) {
    if (n === 0) return 0;
    let i;
    for (i = 1; n >= 0; i++) {
        n -= i;
    }
    return i - 2;
};