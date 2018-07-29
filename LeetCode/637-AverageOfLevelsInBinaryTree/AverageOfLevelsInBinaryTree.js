/**
 * Created by liyanxiang on 2017/8/14.
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var averageOfLevels = function(root) {
    // 初始化，nodes为某层结点，average为返回的平均值，num为遍历时原层次结点的数量
    let nodes = [];
    let average = [];
    let num;
    nodes.push(root);
    while (nodes.length) {
        let sum = 0;
        num = nodes.length;
        for (let i = 0; i < num; i++) {
            // 遍历当前节点数组
            // 1.累加当前层次的值域
            // 2.获取下一层次的结点
            first = nodes.shift();
            sum += first.val;
            if (first.left) nodes.push(first.left);
            if (first.right) nodes.push(first.right);
        }
        average.push(sum / num);
    }
    return average;
};