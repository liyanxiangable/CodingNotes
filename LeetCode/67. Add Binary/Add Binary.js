/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    a = a.split('');
    b = b.split('');
    let result = '';
    (function add(a, b, carry) {
        let addend1 = a.pop();
        let addend2 = b.pop();
        if (typeof addend1 === 'undefined' && typeof addend2 === 'undefined' && carry === 0) return;
        addend1 = typeof addend1 !== 'undefined' ? addend1 : 0;
        addend2 = typeof addend2 !== 'undefined' ? addend2 : 0;
        let sum = parseInt(addend1) + parseInt(addend2) + carry;
        let number;
        if (sum < 2) {
            number = sum;
            carry = 0;
        } else {
            number = sum - 2;
            carry = 1;
        }
        result = number + result;
        add(a, b, carry);
    }) (a, b, 0, result);
    return result;
};

