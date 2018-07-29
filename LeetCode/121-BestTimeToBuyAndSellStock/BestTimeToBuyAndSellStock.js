/**
 * Created by liyanxiang on 2017/8/23.
 */
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let maxProfitSoFar = 0;
    let maxProfitEndingHere = 0;
    for (let i = 0; i < prices.length - 1; i++) {
        maxProfitEndingHere = Math.max(maxProfitEndingHere += prices[i + 1] - prices[i], 0);
        maxProfitSoFar = Math.max(maxProfitSoFar, maxProfitEndingHere);
    }
    return maxProfitSoFar;
};