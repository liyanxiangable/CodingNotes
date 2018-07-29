/**
 * Created by liyanxiang on 2017/8/20.
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
var sumOfLeftLeaves = function(root) {
    var sum = 0;
    function preOrderTraversal(root) {
        if (root) {
            if (root.left && root.left.left === null && root.left.right === null) {
                sum += root.left.val;
            }
            preOrderTraversal(root.left);
            preOrderTraversal(root.right);
        }
    }
    preOrderTraversal(root, sum);
    return sum;
};