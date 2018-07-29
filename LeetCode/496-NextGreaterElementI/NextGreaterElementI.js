/**
 * Created by liyanxiang on 2017/8/14.
 */
/*
var nextGreaterElement = function(findNums, nums) {
    let ngn = [];
    nums.sort(function (a, b) { return a - b });
    for (let fn of findNums) {
        for (let index of nums[index]) {
            if (fn === nums[index]) {
                if (typeof nums[index + 1] === 'undefined') {
                    ngn.push(-1);
                } else {
                    ngn.push(nums[index + 1]);
                }
            }
        }
    }
    return ngn;
};
*/


/**
 * @param {number[]} findNums
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElement = function(findNums, nums) {
    let ngn = [];
    for (let fn of findNums) {
        let ngnNum = null;
        for (let n of nums) {
            if (fn === n) {
                ngnNum = -1;
            }
            if (ngnNum === -1 && fn < n) {
                ngnNum = n;
                break;
            }
        }
        ngn.push(ngnNum);
    }
    return ngn;
};