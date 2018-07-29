/**
 * Created by liyanxiang on 2017/9/13.
 */
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function(flowerbed, n) {
    // 对整个花圃进行遍历
    let length = flowerbed.length;
    for(let i = 0; i < length; i++) {
        if (flowerbed[i] === 0) {
            let prev = (i - 1) < 0 ? 0 : flowerbed[i - 1];
            let next = (i + 1) >= length ? 0 : flowerbed[i + 1];
            if (prev === 0 && next === 0) {
                flowerbed[i] = 1;
                n--;
            }
        }
        if (n < 0) {
            return true;
        }
    }
    return n <= 0;
};