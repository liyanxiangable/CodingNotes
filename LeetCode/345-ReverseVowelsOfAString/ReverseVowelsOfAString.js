/**
 * Created by liyanxiang on 2017/8/28.
 */
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
    let vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    let begin = 0, end = s.length - 1;
    s = s.split('');
    while (begin < end) {
        if (!vowels.has(s[begin])) {
            begin++;
        }
        if (!vowels.has(s[end])) {
            end--;
        }
        if (vowels.has(s[begin]) && vowels.has(s[end])) {
            let temp = s[begin];
            s[begin] = s[end];
            s[end] = temp;
            end--;
            begin++;
        }
    }
    return s.join('');
};