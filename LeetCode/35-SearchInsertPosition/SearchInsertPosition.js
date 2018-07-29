/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let position = 0;
    if (target <= nums[0]) {
        return 0;
    }
    if (target === nums[nums.length - 1]) {
        return nums.length - 1;
    }
    if (target > nums[nums.length - 1]) {
        return nums.length
    }
    for (let i = 0; i < nums.length; i++) {
        if (target > nums[i]) {
            position = i;
        } else {
            position++;
            break;
        }
    }
    return position;
};