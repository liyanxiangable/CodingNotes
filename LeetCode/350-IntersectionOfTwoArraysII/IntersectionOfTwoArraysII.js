/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    let intersection = [];
    function compare(a, b) {return a - b}
    nums1.sort(compare);
    nums2.sort(compare);
    let index1 = 0, index2 = 0;
    while (index1 < nums1.length && index2 < nums2.length) {
        if (nums1[index1] === nums2[index2]) {
            intersection.push(nums1[index1]);
            index2++;
            index1++;
        } else if (nums1[index1] < nums2[index2]) {
            index1++;
        } else if (nums1[index1] > nums2[index2]) {
            index2++;
        }
    }
    return intersection;
};