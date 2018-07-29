/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {
    let set = new Set();
    for (let i = 0; i < k + 1 && i < nums.length; i++) {
        if (!set.has(nums[i])) {
            set.add(nums[i])
        } else {
            console.log('dd')
            return true;
        }
    }
    let back = 0; let front = k + 1;
    while (front < nums.length) {
        set.delete(nums[back]);
        if (set.has(nums[front])) {
            return true;
        } else {
            set.add(nums[front]);
        }
        front++;
        back++;
    }
    return false;
};