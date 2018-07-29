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
var getMinimumDifference = function(root) {
    let nodes = [];
    inOrderTraversal(root, nodes);
    let difference = nodes[1] - nodes[0];
    for (let i = 1; i < nodes.length - 1; i++) {
        if (difference > nodes[i + 1] - nodes[i]) {
            difference = nodes[i + 1] - nodes[i];
        }
    }
    return difference;
};

function inOrderTraversal(root, nodes) {
    if (root !== null) {
        inOrderTraversal(root.left);
        nodes.push(root.val);
        inOrderTraversal(root.right);
    }
}