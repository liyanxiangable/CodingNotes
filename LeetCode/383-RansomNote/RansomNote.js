/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function(ransomNote, magazine) {
    let note = ransomNote.split('').sort();
    let maga = magazine.split('').sort();
    let index = 0, num = maga.length;
    for (let letter of note) {
        let found = false;
        while (index < num) {
            if (letter === maga[index]) {
                found = true;
                index++;
                break;
            }
            index++;
        }
        if (!found) {
            return false;
        }
    }
    return true;
};