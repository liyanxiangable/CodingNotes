/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findErrorNums = function(nums) {
    // x表示重复的数字，y表示缺少的数字
    let x, y;
    // sum计算给出的数组个元素之和。
    // 原来的时候是 (n + 1) * n / 2。现在是 (n + 1) * n / 2 + x - y
    let sum = 0;
    // 初始化一个数组储存每个数字出现次数，
    // 长度为给出数组长的长度，默认值填充为0
    let times = new Array(nums.length).fill(0);
    for (let n of nums) {
        sum += n;
        // 如果遍历到某个数，就增加相应数字的索引位置的次数
        // 但是有一点是给出的数是1到n，索引却是0到n-1.
        // 所以有一个1的补偿量
        times[n - 1]++;
        // 一旦找出某数的出现次数不止一次，就找到了x
        if (times[n - 1] === 2) {
            x = n;
        }
    }
    // 通过数组之和来确定y
    y = (n + 1) * n / 2 + x - sum;
    return [x, y];
};