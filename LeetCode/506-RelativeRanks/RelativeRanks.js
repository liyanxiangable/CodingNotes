/**
 * Created by liyanxiang on 2017/8/21.
 */
/**
 * @param {number[]} nums
 * @return {string[]}
 */
var findRelativeRanks = function(nums) {
    nums.sort(function (a, b) { return a - b });
    nums.forEach(num => {
        if (num === 1) {
            num = "Gold Medal";
        } else if (num === 2) {
            num = "Silver Medal";
        } else if (num === 3) {
            num = "Bronze Medal";
        } else {
            num = "" + num;
        }
        return num;
    });
    return nums;
};
读不懂题目