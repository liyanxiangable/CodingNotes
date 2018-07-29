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
 * @param {number} sum
 * @return {number}
 */
var pathSum = function(root, sum) {
    if (root === null) return 0;
    return pathSum(root.left, sum) + pathSum(root.right, sum) + hasPathSum(root, 0, sum);
};

function hasPathSum(root, prev, sum) {
    if (root === null) return 0;
    let now = root.val + prev;
    let current = now === sum ? 1 : 0;
    return current + hasPathSum(root.left, now, sum) + hasPathSum(root.right, now, sum);
}