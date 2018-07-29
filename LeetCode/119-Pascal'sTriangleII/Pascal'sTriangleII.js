/**
 * Created by liyanxiang on 2017/8/29.
 */
/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function(rowIndex) {
    let row = []
    for (let i = 0; i < rowIndex + 1; i++) {
        row[i] = combination(i, rowIndex);
    }
    return row;
};

function combination(m, n) {
    if (m === 0) return 1;
    let a = b = c = 1, p = n - m;
    while (m > 0) {
        a *= m--;
    }
    while (n > 0) {
        b *= n--;
    }
    while (p > 0) {
        c *= p--;
    }
    return b / a / c;
}