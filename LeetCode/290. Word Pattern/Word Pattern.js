/**
 * Created by liyanxiang on 2017/9/11.
 */
/**
 * @param {string} pattern
 * @param {string} str
 * @return {boolean}
 */
var wordPattern = function(pattern, str) {
    let array = str.split(' ');
    if (array.length !== pattern.length) return false;
    let hashPattern = {}, hashStr = {};
    let point = 0;
    while (point < array.length) {
        if (hashStr[array[point]]) {
            if (hashStr[array[point]] !== pattern[point]) {
                return false;
            }
        } else {
            hashStr[array[point]] = pattern[point];
        }
        if (hashPattern[pattern[point]]) {
            if (hashPattern[pattern[point]] !== array[point]) {
                return false;
            }
        } else {
            hashPattern[pattern[point]] = array[point];
        }
        point++;
    }
    return true;
};