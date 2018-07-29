/**
 * Created by liyanxiang on 2017/8/21.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    if (nums.length < 3) {
        return nums[0];
    }
    nums.sort();
    let i = Math.floor(nums.length / 2);
    if (nums.length % 2) {
        return nums[i];
    } else {
        if (nums[i] === nums[i - 1] && nums[i] === nums[i + 1]) {
            return nums[i];
        } else {
            return nums[i - 1];
        }
    }
};