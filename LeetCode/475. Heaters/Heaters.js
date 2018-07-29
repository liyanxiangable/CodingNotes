/**
 * Created by liyanxiang on 2017/9/13.
 */
/**
 * @param {number[]} houses
 * @param {number[]} heaters
 * @return {number}
 */
var findRadius = function(houses, heaters) {
    // 寻找两个数组中各个元素之差的最小值，首先两个数组都是有序的
    // less是第一个数组中相对第二个数组中某个元素的较小的值的索引
    // more是第一个数组中相对第二个数组中某个元素的较大的值的素银
    // current是第二个数组中的某个元素的索引
    let less = 0;
    let more = 0;
    let current = 0;
    let max = 0;

    while (current < heaters.length) {
        // 如果第一个数组中较大的值小于第二个数组中的当前值，就将索引递增
        if (houses[more] < heaters[current]) {
            more++;
            continue;
        } else {
            // 分为两种情况，一是相等，二是大于
            if (houses[more] === heaters[current]) {
                less = more - 1;
                more++;
            } else if (houses[more] > heaters[current]) {
                // 如果more指向的元素大于current指向的元素，那么less指向的元素有可能与current指向元素相等
                if (houses[more - 1] === heaters[current]) {
                    less = more - 2;
                } else if (houses[more - 1] < heaters[current]) {
                    less = more - 1;
                }
            }
        }
        if (less < 0) {
            houses[less] = heaters[current];
        }
        let left = heaters[current] - houses[less];
        let right = houses[more] - heaters[current];
        max = Math.max(max, left, right);
        current++;
    }
    return max;
};