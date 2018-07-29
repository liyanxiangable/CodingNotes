/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {number} n
 * @return {number}
 */
var findNthDigit = function(n) {
    let carry = 0;
    let sum = 0;
    while (sum < n) {
        carry++;
        sum += carry * Math.pow(10, carry - 1) * 9;
    }
    let = difference = n - (sum - carry * Math.pow(10, carry - 1) * 9);
    let numStr = Math.floor(difference / carry);
    if (carry !== 1) {
        numStr += Math.pow(10, carry - 1);
    } else {
        return n;
    }
    numStr = String(numStr);
    let remain = difference % carry;
    if (remain === 0) {
        let temp =  Number(numStr[carry - 1]) - 1;
        return temp < 0 ? 9 : temp;
    } else {
        return Number(numStr[remain - 1]);
    }
};