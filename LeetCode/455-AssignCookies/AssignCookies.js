/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
    g.sort(function (a, b) { return a - b });
    s.sort(function (a, b) { return a - b });
    let gIndex = 0, sIndex = 0;
    let assign = 0;
    while (gIndex < g.length && sIndex < s.length) {
        if (s[sIndex] >= g[gIndex]) {
            assign++;
            sIndex++;
            gIndex++;
        } else {
            sIndex++;
        }
    }
    return assign;
};