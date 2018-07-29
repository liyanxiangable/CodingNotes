/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
var minMoves = function(nums) {
    let times = 0;
    let equal = isEqual(nums);
    while (!equal) {
        nums.sort(function (a, b) { return a - b });
        for (let i = 0; i < nums.length - 1; i++) {
            nums[i]++;
        }
        equal = isEqual(nums);
        times++;
    }
    return times;
};

function isEqual(nums) {
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] !== nums[i + 1]) {
            return false;
        }
    }
    return true;
}
*/

var minMoves = function(nums) {
    let sum = 0, min = nums[0];
    for (let num of nums) {
        sum += num;
        if (num < min) {
            min = num;
        }
    }
    return sum - nums.length * min;
};