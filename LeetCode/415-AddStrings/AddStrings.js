/**
 * Created by liyanxiang on 2017/8/23.
 */
var addStrings = function(num1, num2) {
    let basic = '0'.charCodeAt();
    let result = [];
    let numArr1 = num1.split('');
    let numArr2 = num2.split('');
    let sum = 0, carry = 0;
    while (numArr1.length || numArr2.length || carry !== 0) {
        let n1 = numArr1.length !== 0 ? numArr1.pop().charCodeAt() - basic : 0;
        let n2 = numArr2.length !== 0 ? numArr2.pop().charCodeAt() - basic : 0;
        sum = n1 + n2 + carry;
        if (sum >= 10) {
            carry = 1;
            sum -= 10;
        } else {
            carry = 0;
        }
        result.unshift(String.fromCharCode(sum + basic));
    }
    return result.join('');
};