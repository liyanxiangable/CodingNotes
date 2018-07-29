/**
 * Created by liyanxiang on 2017/8/21.
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
var findTilt = function(root) {
    let sum = 0;
    (function preOrderTraversal(root) {
        if (root) {
            preOrderTraversal(root.left);
            preOrderTraversal(root.right);
            let left = root.left === null ? 0 : root.left.val;
            let right = root.right === null ? 0 : root.right.val;
            sum += Math.abs(left - right);
            root.val = root.val + left + right;
        }
    })(root);
    return sum;
};