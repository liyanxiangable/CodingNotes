/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function(s, k) {
    let arr = [];
    let end = 0, start;
    while (s.length > end) {
        start = end;
        end += k;
        arr.push(s.slice(start, end));
    }
    let string = '';
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
            arr[i] = arr[i].split('').reverse().join('');
        }
        string += arr[i];
    }
    return string;
};