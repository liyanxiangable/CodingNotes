/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
var missingNumber = function(nums) {
    nums.sort(function (a, b) {
        return a - b;
    });
    if (nums[0] !== 0) {
        return 0;
    }
    let miss;
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i + 1] - nums[i] !== 1) {
            miss = nums[i] + 1;
        }
    }
    return typeof miss === 'undefined' ? nums[nums.length - 1] + 1 : miss;
};
*/
var missingNumber = function(nums) {
    let len = nums.length;
    let sum = (0 + len) * (len + 1) / 2;
    for (let n of nums) {
        sum -= n;
    }
    return sum;
};