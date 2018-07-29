
/*
    The Hamming distance between two integers is the number of positions at which the corresponding bits are different.
    Given two integers x and y, calculate the Hamming distance.
    Note: 0 ≤ x, y < 2（31）.
    两个整数的汉明距离是（2进制中）不同的位的数目
    计算两个数X、Y之间的汉明距离，（X、Y大于等于0，小于2的31次方）

Example:
    Input: x = 1, y = 4
    Output: 2

Explanation:
    1   (0 0 0 1)
    4   (0 1 0 0)
           ？  ？
    The above arrows point to positions where the corresponding bits are different.
*/
/*
var x, y, z, distance = 0;
x = 1;
y = 4;
z = x ^ y;
console.log(z);

while (z > 0) {
    if (z % 2 === 1) {
        z -= 1;
        distance++;
    }
    z /= 2;
}
console.log(distance);
*/
var hammingDistance = function(x, y) {
    var z, distance = 0;
    z = x ^ y;
    while (z > 0) {
        if (z % 2 === 1) {
            z -= 1;
            distance++;
        }
        z /= 2;
    }
    return distance;
};