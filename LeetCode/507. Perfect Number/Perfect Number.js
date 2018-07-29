/**
 * Created by liyanxiang on 2017/9/9.
 */
/**
 * @param {number} num
 * @return {boolean}
 */
var checkPerfectNumber = function(num) {
    sum = 0;
    let lastDivisor = num;
    for (let i = 1; i <= lastDivisor; i++) {
        if (num % i === 0) {
            if (lastDivisor === num) {
                lastDivisor = num / i;
            }
            sum += i;
        }
    }
    return sum === num;
};