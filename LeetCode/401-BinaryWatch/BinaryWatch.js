/**
 * Created by liyanxiang on 2017/8/22.
 */
/**
 * @param {number} num
 * @return {string[]}
 */
var readBinaryWatch = function(num) {
    let time = [];
    for (let h = 0; h < 12; h++) {
        for (let m = 0; m < 60; m++) {
            let ones = new Array(10).fill(0);
            let hour = h, minute = m;
            if (minute >= 32) {
                ones[4] = 1;
                minute -= 32;
            }
            if (minute >= 16) {
                ones[5] = 1;
                minute -= 16;
            }
            if (minute >= 8) {
                ones[6] = 1;
                minute -= 8;
            }
            if (minute >= 4) {
                ones[7] = 1;
                minute -= 4;
            }
            if (minute >= 2) {
                ones[8] = 1;
                minute -= 2;
            }
            if (minute >= 1) {
                ones[9] = 1;
                minute -=1;
            }
            if (hour >= 8) {
                ones[0] = 1;
                hour -= 8;
            }
            if (hour >= 4) {
                ones[1] = 1;
                hour -= 4;
            }
            if (hour >= 2) {
                ones[2] = 1;
                hour -= 2;
            }
            if (hour >= 1) {
                ones[3] = 1;
                hour -= 1;
            }
            let n = 0;
            for (let one of ones) {
                if (one === 1) {
                    n++;
                }
            }
            if (n === num) {
                let string = '' + h + ':' + (m < 10 ? '0' + m : m);
                time.push(string);
            }
        }
    }
    return time;
};