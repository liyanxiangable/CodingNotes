/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {string} s
 * @return {boolean}
 */
var checkRecord = function(s) {
    return s.indexOf('LLL') === -1 && s.indexOf('A') === s.lastIndexOf('A');
};