/**
 * Created by liyanxiang on 2017/9/10.
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
 * @return {number}
 */
var minDepth = function(root) {
    if (root === null) return 0;
    let left, right;
    if (root.left === null && root.right === null) {
        return 1;
    }
    if (root.left) {
        left = minDepth(root.left);
    } else {
        left = Infinity;
    }
    if (root.right) {
        right = minDepth(root.right);
    } else {
        right = Infinity;
    }
    return 1 + Math.min(left, right);
};