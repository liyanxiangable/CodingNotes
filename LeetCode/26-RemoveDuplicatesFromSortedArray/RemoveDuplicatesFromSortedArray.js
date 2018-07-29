/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let duplications = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) {
            duplications++;
        }
        nums[i - duplications] = nums[i];
    }
    return nums.length - duplications;
};