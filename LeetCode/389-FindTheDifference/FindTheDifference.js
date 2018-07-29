/**
 * Created by liyanxiang on 2017/8/19.
 */
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function(s, t) {
    let ascii = 0;
    for (let tChar of t) {
        s += tChar;charCodeAt(0);
    }
    for (let sChar of s) {
        s -= sChar.charCodeAt(0);
    }
    return ascii;
};