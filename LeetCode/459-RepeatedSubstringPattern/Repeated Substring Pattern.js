/**
 * Created by liyanxiang on 2017/8/29.
 */
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function(s) {
    if (s.length <= 1) {
        return false;
    }
    let lastLetter = s[s.length - 1];
    let occurrence = -1;
    let assumeStr;
    while (assumeStr !== s) {
        occurrence++;
        assumeStr = '';
        occurrence = findNextOccurrence(s, occurrence, lastLetter);
        if (occurrence === -1) {
            return false;
        }
        if (s.length % (occurrence + 1) !== 0) {
            continue;
        }
        let times = s.length / (occurrence + 1);
        while (times--) {
            assumeStr += s.substring(0, occurrence + 1);
        }
        if (assumeStr === s) {
            return true;
        }
    }
};

function findNextOccurrence(s, occurrence, lastLetter) {
    for (let i = occurrence; i < Math.floor(s.length / 2); i++) {
        if (s[i] === lastLetter) {
            return i;
        }
    }
    return -1;
};