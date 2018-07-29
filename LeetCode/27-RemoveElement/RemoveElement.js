/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let len = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[len++] = nums[i];
        }
    }
    return len;
};