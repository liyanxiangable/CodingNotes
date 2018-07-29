/**
 * Created by liyanxiang on 2017/8/28.
 */
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    if (numRows === 0) return [];
    let YangHui = [[1]];
    for (let i = 1; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < i + 1; j++) {
            if (j === 0 || j === i) {
                row.push(1);
            } else {
                row.push(YangHui[i - 1][j] + YangHui[i - 1][j - 1])
            }
        }
        YangHui.push(row);
    }
    return YangHui;
};