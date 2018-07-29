/**
 * Created by liyanxiang on 2017/9/15.
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findPairs = function(nums, k) {
    let obligationSet = new Set();
    let kDiffSet = new Set();
    let count = 0;
    // 先进行去重sort，简化之后的操作
    for (let i = 0; i < nums.length - 1; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i - count] > nums[j]) {
                temp = nums[j];
                nums[j] = nums[i - count];
                nums[i - count] = temp;
            }
        }
        if (i >= 1 && nums[i] === nums[i - 1]) {
            count++;
        }
    }
    console.log(nums);
    nums.sort(function (a, b) { return a - b });
    for (let n of nums) {
        if (obligationSet.has(n - k)) {
            kDiffSet.add([n - k, n]);
        } else {
            obligationSet.add(n + k);
        }
    }
};