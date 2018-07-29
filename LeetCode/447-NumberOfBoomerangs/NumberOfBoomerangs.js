/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {number[][]} points
 * @return {number}
 */
var numberOfBoomerangs = function(points) {
    let bNum = 0;
    for (let i = 0; i < points.length; i++) {
        let distances = {};
        for (let p = 0; p < points.length; p++) {
            if (p !== i) {
                let distance = Math.pow(Math.abs(points[i][0] - points[p][0]), 2) +
                    Math.pow(Math.abs(points[i][1] - points[p][1]), 2);
                if (typeof distances[distance] !== 'undefined') {
                    distances[distance]++;
                } else {
                    distances[distance] = 1;
                }
            }
        }
        for (let dist in distances) {
            if (distances[dist] > 1) {
                bNum += distances[dist] * (distances[dist] - 1);
            }
        }
    }
    return bNum;
};