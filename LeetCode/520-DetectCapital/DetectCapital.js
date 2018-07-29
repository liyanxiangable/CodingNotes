/**
 * Created by liyanxiang on 2017/8/15.
 */
/**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function(word) {
    let charArray = word.split('');
    if (isUpperCase(charArray[0])) {
        if (charArray[1]) {
            if (isUpperCase(charArray[1])) {
                for (let i = 1; i < charArray.length; i++) {
                    if (isLowerCase(charArray[i])) {
                        return false;
                    }
                }
            } else {
                for (let i = 1; i < charArray.length; i++) {
                    if (isUpperCase(charArray[i])) {
                        return false;
                    }
                }
            }
        }
    } else {
        for (let char of charArray) {
            if (isUpperCase(char)) {
                return false;
            }
        }
    }
    return true;
};

function isUpperCase(char) {
    return char === char.toUpperCase();
}
function isLowerCase(char) {
    return char === char.toLowerCase();
}