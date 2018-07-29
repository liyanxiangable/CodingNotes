/**
 * Created by liyanxiang on 2017/8/13.
 */

/*


var matrixReshape = function(nums, r, c) {
    // 首先判断参数r、c时候合理。条件就是nems矩阵的元素个数等于c * r
    // 同时获得原矩阵的行数与列数，mr为原矩阵行数，mc为原矩阵列数
    let mr = nums.length, mc = nums[0].length;
    if (mr * mc !== r * c) {
        return nums;
    } else {
        // 动态创建二维数组，话说js不显式地创建多维数组真麻烦
        let newMatrix = [];
        for (let m = 0; m < r; m++) {
            newMatrix[m] = [];
            for (let n = 0; n < c; n++) {
                newMatrix[m][n] = null;
            }
        }
        let order = 0;
        // 对新的矩阵的行进行遍历赋值
        for (let i = 0; i < r; i++) {
            // 对新的矩阵的列进行连理赋值
            for (let j = 0; j < c; j++) {
                // 现在所在的位置就是新的矩阵的某个元素的位置、
                // 此位置需要进行赋值，由于赋值的顺序的关系
                // 可以知道当前的位置是第 order = i * r + j 个元素，或者直接进行累加也可以
                // 对应到原矩阵 mr * x + y = i * r + j, (y <= mc), 注意这里的x与y不是索引，而是数量，从1开始
                // 求解得出x与y即可得到相对应的原矩阵中元素的位置
                order++;
                // x为此序列元素在原矩阵中的行数，y为此序列元素在原矩阵中的列数
                // 这里注意js中没有数据类型概念。所以要手动向下取整
                let x = Math.floor(order / mc);
                let y = order % mr;
                // 对x、y结果进行修正
                if (y === 0) {
                    x += 1;
                    y = mc;
                }
                newMatrix[i][j] = nums[x - 1][y - 1];
            }
        }
        return newMatrix;
    }
};


*/


// 受制于js中数组并不是很给力，上边的代码不能运行
// 如果对原矩阵进行遍历进行push到新矩阵，而不是对新矩阵循环赋值。这样简便一些
/**
 * @param {number[][]} nums
 * @param {number} r
 * @param {number} c
 * @return {number[][]}
 */
var matrixReshape = function(nums, r, c) {
    // 首先判断参数r、c时候合理。条件就是nems矩阵的元素个数等于c * r
    if (nums.length * nums[0].length !== r * c) {
        return nums;
    } else {
        // 新矩阵
        let newMatrix = [];
        // 新矩阵的某一行
        let newRow = [];
        // 对原矩阵进行遍历
        for (let row of nums) {
            for (let col of row) {
                console.log(col);
                // 当新矩阵的某一行不满时，将旧矩阵中的元素加入这一行
                if (newRow.length === c) {
                    newMatrix.push(newRow);
                    newRow = [];
                }
                newRow.push(col);
            }
        }
        // 最后对虽然数组长度为c，但是由于循环结构不再将newRow添加到newMatrix的情况进行补充
        if (newRow.length) {
            newMatrix.push(newRow);
        }
        return newMatrix;
    }
};