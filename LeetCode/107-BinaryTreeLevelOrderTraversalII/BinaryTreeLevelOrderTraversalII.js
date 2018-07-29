/**
 * Created by liyanxiang on 2017/8/25.
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
 * @return {number[][]}
 */
var levelOrderBottom = function(root) {
    let treeArr = [];
    if (root === null) {
        return treeArr;
    }
    // nodes用于储存当前层次的所有结点，以便于遍历
    let nodes = [root];
    // 进行层次遍历
    while (nodes.length) {
        // row是一个临时数组，表示当前层次的结点，他作为最后输出的treeArr的一个元素
        let row = [];
        let length = nodes.length;
        while (length--) {
            let node = nodes.shift();
            row.push(node.val);
            if (node.left !== null) nodes.push(node.left);
            if (node.right !== null) nodes.push(node.right);
        }
        treeArr.unshift(row);
    }
    return treeArr;
};