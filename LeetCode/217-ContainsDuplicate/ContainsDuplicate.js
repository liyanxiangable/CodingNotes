/**
 * Created by liyanxiang on 2017/8/21.
 */
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    let set = new Set(nums);
    return set.size !== nums.length;
};