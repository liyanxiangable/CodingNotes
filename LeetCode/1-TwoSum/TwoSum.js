/**
 * Created by liyanxiang on 2017/9/6.
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
/*
var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};
*/
var twoSum = function(nums, target) {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        // 将数组的值作为key，数组的索引作为value
        // 因此要考虑key值的重复
        if (map.has(nums[i])) {
            // 已有数组中的数值作为key

        } else {
            if ()
        }
    }
};