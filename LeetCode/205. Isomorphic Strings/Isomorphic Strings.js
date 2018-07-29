/**
 * Created by liyanxiang on 2017/9/9.
 */
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function(s, t) {
    let sCount = {}, tCount = {};
    for (let i = 0; i < s.length; i++) {
        if (tCount[t[i]] !== sCount[s[i]]) {
            return false;
        }
        sCount[s[i]] = i;
        tCount[t[i]] = i;
    }
    return true;
};