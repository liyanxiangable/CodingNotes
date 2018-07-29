/**
 * Created by liyanxiang on 2017/8/9.
 */
/**
 * @param {number} num
 * @return {number}
 */
var findComplement = function(num) {
    var mask = ~0;
    while (mask & num) {
        mask <<= 1;
    }
    return ~mask & ~num;
};
console.log(findComplement(5));