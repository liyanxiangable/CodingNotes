/**
 * Created by liyanxiang on 2017/7/28.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function(nums) {
    nums.sort(function (a, b) {
        return a >= b ? 1 : -1;
    });
    var sum = 0;
    for (var i = 0; i < nums.length; i += 2) {
        sum += nums[i];
    }
    return sum;
};
arrayPairSum();
