/**
 * Created by liyanxiang on 2017/8/27.
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
var isSymmetric = function(root) {
    if (root === null) return true;
    let nodes1 = [root];
    while (nodes1.length) {
        let len = nodes1.length;
        for (let i = 0; i < Math.ceil(len / 2); i++) {
            if (nodes1[i].val !== nodes1[len - 1 - i].val) {
                return false;
            }
            if (nodes1[i].left === null && nodes1[len - 1 - i].right !== null) {
                return false;
            }
            if (nodes1[i].right === null && nodes1[len - 1 - i].left !== null) {
                return false;
            }
        }
        while (len--) {
            let node = nodes1.pop();
            if (node.left && node.right) {
                nodes1.unshift(node.left);
                nodes1.unshift(node.right);
            } else if (node.left === null && node.right !== null) {
                nodes1.unshift(new TreeNode(null));
                nodes1.unshift(node.right);
            } else if (node.left !== null && node.right === null) {
                nodes1.unshift(node.left);
                nodes1.unshift(new TreeNode(null));
            }
        }
    }
    return true;
};