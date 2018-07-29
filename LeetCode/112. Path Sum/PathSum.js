/**
 * Created by liyanxiang on 2017/9/8.
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
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
    return preOrderTraversalAdding(root, 0, sum);
};

preOrderTraversalAdding = function (root, temp, sum) {
    if (root === null) {
        return false;
    }
    if (root.left === null && root.right === null && temp + root.val === sum) {
        return true;
    }
    return preOrderTraversalAdding(root.left, temp + root.val, sum) || preOrderTraversalAdding(root.right, temp + root.val, sum);
};