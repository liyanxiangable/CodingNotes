/**
 * Created by liyanxiang on 2017/8/28.
 */
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function(num) {
    let low = 1, high = num;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let square = mid * mid;
        if (square < num) {
            low = mid + 1;
        } else if (square > num) {
            high = mid - 1;
        } else {
            return true;
        }
    }
    return false;
};