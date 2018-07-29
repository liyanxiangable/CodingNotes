/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {string} s
 * @return {number}
 */
var titleToNumber = function(s) {
    const basic = 'A'.charCodeAt();
    let column = 0;
    let power = s.length;
    for (let i = 0; i < power; i++) {
        column += Math.pow(26, power - i -1) * (s[i].charCodeAt() - basic + 1);
    }
    return column;
};