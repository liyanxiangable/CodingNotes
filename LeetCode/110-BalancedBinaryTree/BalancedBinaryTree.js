/**
 * Created by liyanxiang on 2017/8/29.
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
 * @return {boolean}
 */
var isBalanced = function(root) {
    if (root === null) {
        return true;
    }
    return isBalanced(root.left) && isBalanced(root.right) && Math.abs(height(root.left) - height(root.right)) <= 1;
};

function height(root) {
    if (root === null) {
        return 0;
    }
    return Math.max(height(root.left), height(root.right)) + 1;
}