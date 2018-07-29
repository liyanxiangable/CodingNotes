/**
 * Created by liyanxiang on 2017/8/15.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
var findMaxConsecutiveOnes = function(nums) {
    var arrs = nums.join('').split(0);
    let length = 0;
    for (let arr of arrs) {
        if (arr.length > length) {
            length = arr.length;
        }
    }
    return length;
};
*/
var findMaxConsecutiveOnes = function(nums) {
    let maxLength = 0;
    let length = 0;
    for (let num of nums) {
        if (num === 1) {
            length++;
        } else if (num === 0) {
            lenArr.push(length);
            length = 0;
        }
        if (maxLength < length) {
            maxLength = length;
        }
    }
    return maxLength;
};