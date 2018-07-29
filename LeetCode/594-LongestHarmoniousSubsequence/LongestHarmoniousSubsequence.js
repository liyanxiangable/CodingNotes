/**
 * Created by liyanxiang on 2017/8/24.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLHS = function(nums) {
    let lengths = {};
    for (let n of nums) {
        if (typeof lengths[n] === 'undefined') {
            lengths[n] = 1;
        } else {
            lengths[n]++;
        }
    }
    let keys = Object.keys(lengths).sort((a, b) => a - b);
    let maxLengthSoFar = 0, maxLengthEndingHere = 0;
    for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i + 1] - keys[i] === 1) {
            maxLengthEndingHere = nums[keys[i + 1]] + nums[keys[i]];
        } else {
            maxLengthEndingHere = nums[keys[i]];
        }
        maxLengthSoFar = Math.max(maxLengthSoFar, maxLengthEndingHere);
    }
    return maxLengthSoFar;
};