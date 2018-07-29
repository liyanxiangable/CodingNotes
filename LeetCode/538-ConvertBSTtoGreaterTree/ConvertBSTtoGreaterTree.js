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
 * @return {TreeNode}
 */
var convertBST = function(root) {
    let nodes = [];
    function inOrderTraversal(root, arr) {
        if (root) {
            inOrderTraversal(root.left, arr);
            nodes.push(root);
            inOrderTraversal(root.right, arr);
        }
    }
    inOrderTraversal(root, nodes);
    for (let i = nodes.length - 2; i >= 0; i--) {
        nodes[i].val += nodes[i + 1].val;
    }
    return root;
};