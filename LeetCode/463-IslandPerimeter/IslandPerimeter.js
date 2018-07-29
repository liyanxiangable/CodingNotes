/**
 * Created by liyanxiang on 2017/8/14.
 */
/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function(grid) {
    // 计算陆地小格数量，收集陆地坐标
    let land = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 1) {
                land.push([i,j]);
            }
        }
    }
    n = land.length;
    console.log(land);

    let m = 0;
    // 收集的位置本身就是根据纵坐标排列好的，因此不必再排序
    for (let i = 0; i < n - 1; i++) {
        // 如果坐标与他相邻位置（）的坐标的纵坐标相同，且横坐标只相差1个单位
        // 那么就说明两陆地小格相邻
        if (land[i][0] === land[i + 1][0] && Math.abs(land[i][1] - land[i + 1][1]) === 1) {
            m++;
        }
    }

    // 根据横轴坐标进行排序
    land.sort(function (a, b) {
        if (a[1] > b[1]) {
            return 1;
        } else if (a[1] < b[1]) {
            return -1;
        } else if (a[1] === b[1]) {
            //如果第一潘旭条件为相等的话，则使用 第二排序规则
            return a[0] - b[0];
        }
    });
    // 遍历整个排序后的坐标
    for (let i = 0; i < n - 1; i++) {
        // 如果坐标与他相邻位置（）的坐标的横坐标相同，且纵坐标只相差1个单位
        // 那么就说明两陆地小格相邻
        if (land[i][1] === land[i + 1][1] && Math.abs(land[i][0] - land[i + 1][0]) === 1) {
            m++;
        }
    }

    return 4 * n - 2 * m;
};