/**
 * Created by liyanxiang on 2017/8/28.
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function(nums, k) {
    let sum = 0;
    for (let i = 0; i < k; i++) {
        sum += nums[i];
    }
    let max = sum;
    for (let j = 1; j < nums.length - k + 1; j++) {
        sum += -nums[j - 1] + nums[j + k - 1]
        max = Math.max(max, sum);
    }
    return max / k;
};