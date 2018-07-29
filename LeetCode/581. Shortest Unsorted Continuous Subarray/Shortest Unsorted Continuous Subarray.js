/**
 * Created by liyanxiang on 2017/9/14.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var findUnsortedSubarray = function(nums) {
    if (nums.length < 2) {
        return 1;
    }
    let start = 0;
    let end = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            if (start === 0) {
                start = i;
            }
            end = i + 1;
        }
    }
    if (end === 0) {
        return 0;
    }
    let min = max = nums[start];
    for (let j = start; j <= end; j++) {
        if (min > nums[j]) {
            min = nums[j];
        }
        if (max < nums[j]) {
            max = nums[j];
        }
    }
    for (let p = start - 1; p >= 0; p--) {
        if (nums[p] <= nums[min]) {
            start = p + 1;
            break;
        }
    }
    for (let q = end + 1; q < nums.length; q++) {
        if (nums[q] >= nums[min]) {
            end = q - 1;
        }
    }
    for (let outer = start; outer <= end; outer++) {
        for (let inner = outer + 1; inner <= end; inner++) {
            if (nums[outer] > nums[inner]) {
                let temp = nums[outer];
                nums[outer] = nums[inner];
                nums[inner] = temp;
            }
        }
    }
    return end - start + 1;
};