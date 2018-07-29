/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if (strs.length === 0) return '';
    let prefix = '';
    let length = strs[0].length;
    for (let str of strs) {
        if (length > str.length) {
            length = str.length;
        }
    }
    let i = 0;
    let over = false;
    while (i < length) {
        let letter;
        let once = true;
        for (let str of strs) {
            if (once) {
                letter = str[i];
                once = false;
            }
            if (str[i] !== letter) {
                over = true;
                break;
            }
        }
        if (!over) {
            i++;
            prefix += letter;
        } else {
            break;
        }
    }
    return prefix;
};