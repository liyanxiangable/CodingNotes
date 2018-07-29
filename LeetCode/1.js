/**
 * Created by liyanxiang on 2017/9/13.
 */
function first(n) {
    let result = '';
    if (n < 0) {
        result += '-';
    }
    let carry = 0;
    for (let carry = 0; carry < 5; carry++) {
        if (Math.pow(10, carry) <= n) {
            continue;
        } else {
            break;
        }
    }
    while (--carry) {
        result += Math.pow(10, carry) + ' ';
    }
    return result.split(' ');
}