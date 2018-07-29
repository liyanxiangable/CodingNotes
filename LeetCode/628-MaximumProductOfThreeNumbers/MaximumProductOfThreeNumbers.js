/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumProduct = function(nums) {
    nums.sort(function (a, b) { return a - b});
    return nums[nums.length - 1] * Math.max(nums[nums.length - 2] * nums[nums.length - 3], nums[0] * nums[1]);
};
