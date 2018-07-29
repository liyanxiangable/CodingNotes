/**
 * Created by liyanxiang on 2017/8/27.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
var rob = function(nums) {
    if (nums.length === 0) {
        return 0;
    }
    if (nums.length === 1) {
        return nums[0];
    }
    let dp = new Array(nums);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }

    return dp[dp.length - 1];
};
*/
var rob = function(nums) {
    if (nums.length === 0) {
        return 0;
    }
    if (nums.length === 1) {
        return nums[0];
    }
    let dpPrevPrev = nums[0];
    let dpPrev = Math.max(nums[0], nums[1]);
    let dpNow = dpPrev;
    for (let i = 2; i < nums.length; i++) {
        dpNow = Math.max(dpPrev, dpPrevPrev + nums[i]);
        dpPrevPrev = dpPrev;
        dpPrev = dpNow;
    }
    return dpNow;
};