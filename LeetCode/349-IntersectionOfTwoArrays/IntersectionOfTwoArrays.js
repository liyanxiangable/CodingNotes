/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    let set1 = new Set(nums1);
    let set2 = new Set(nums2);
    console.log(set1, set2);
    let intersection = [];
    for (let num1 of set1) {
        for (let num2 of set2) {
            if (num2 === num1) {
                intersection.push(num2);
            }
        }
    }
    return intersection;
};