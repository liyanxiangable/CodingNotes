/**
 * Created by liyanxiang on 2017/8/15.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    // 数组进行排序
    nums.sort(function (a, b) { return a - b });
    // 遍历数组，由于要进行比较，所以到nums - 1为止
    for (let i = 0; i < nums.length - 1; i += 2) {
        // 对于已经排序好并且除了一个数之外都是成对出现的数组，
        // 那个只出现一次的数，打乱比较的结果
        // 比较结果又两种，一是singleNum不在最开始（singleNum排序最小）
        // 一是singleNum在排序后数组的最前面
        // 这两种无论是哪一种，都会使两个两个的比较出现不相等
        if (nums[i] !== nums[i + 1]) {
            return nums[i];
        }
    }
    // 如果没有出现不相等的情况，那么就是最后一个数
    return nums[nums.length - 1];
};