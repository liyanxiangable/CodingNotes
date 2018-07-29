/**
 * Created by liyanxiang on 2017/9/14.
 */
/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function(n) {
    console.log(String(n, 2))
    return ~n;
};

console.log(reverseBits(123))