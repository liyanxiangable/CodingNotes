/**
 * Created by liyanxiang on 2017/8/20.
 */
/**
 * @param {number} area
 * @return {number[]}
 */
var constructRectangle = function(area) {
    let width  = Math.floor(Math.pow(area, 0.5));
    let length = area / width;
    while (length !== Math.floor(length)) {
        width--;
        length = area / width;
    }
    return [length, width];
};