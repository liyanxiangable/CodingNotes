/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0) {
            count++;
            continue;
        }
        if (count !== 0) {
            nums[i - count] = nums[i];
        }
    }
    while (count--) {
        nums[nums.length - count - 1] = 0;
    }
};