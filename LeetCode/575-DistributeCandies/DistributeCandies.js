/**
 * Created by liyanxiang on 2017/8/13.
 */
/**
 * @param {number[]} candies
 * @return {number}
 */
var distributeCandies = function(candies) {
    let eliminate = [candies[1]];
    for (let candy of candies) {
        // 设置一个表示去重之后的数组中没有当前遍历到的糖果的标志位
        let hasThisCandy = false;
        for (let item of eliminate) {
            if (candy === item) {
                hasThisCandy = true;
                break;
            }
        }
        if (!hasThisCandy) {
            eliminate.push(candy);
        }
    }
    console.log(eliminate);
    return eliminate.length > candies.length / 2 ? candies.length / 2 : eliminate.length;
};