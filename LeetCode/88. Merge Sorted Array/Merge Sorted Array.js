/**
 * Created by liyanxiang on 2017/9/12.
 */
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    if (n === 0) return;
    if (m === 0) {
        for (let i = 0; i < nums2.length; i++) {
            nums1[i] = nums2[i];
        }
        return;
    }
    let ptr1 = m - 1;
    let ptr2 = n - 1;
    while (ptr1 >= 0 || ptr2 >= 0) {
        if ((nums1[ptr1] < nums2[ptr2]) || (typeof nums1[ptr1] === 'undefined')) {
            nums1[ptr1 + ptr2 + 1] = nums2[ptr2];
            ptr2--;
        } else {
            nums1[ptr1 + ptr2 + 1] = nums1[ptr1];
            ptr1--;
        }
    }
};