/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {number} c
 * @return {boolean}
 */
var judgeSquareSum = function(c) {
    let a = 0, b = Math.ceil(Math.sqrt(c, 0.5));
    while (a <= b) {
        let sum = a * a + b * b;
        if (sum > c) {
            b--;
            continue;
        }
        if (sum < c) {
            a++;
            continue;
        }
        if (sum === c) {
            return true;
        }
    }
    return false;
};