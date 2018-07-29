/**
 * Created by liyanxiang on 2017/8/24.
 */
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    let set = new Set();
    function judge(m) {
        let nums = m.toString().split('');
        sum = 0;
        for (let num of nums) {
            sum += Math.pow(Number(num), 2);
        }
        if (sum === 1) {
            return true;
        }
        if (set.has(sum)) {
            return false;
        } else {
            set.add(sum);
            return judge(sum);
        }
    }
    return judge(n);
};