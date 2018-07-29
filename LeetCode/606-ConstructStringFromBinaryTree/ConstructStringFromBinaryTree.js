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
 * @param {TreeNode} t
 * @return {string}
 */
var tree2str = function(t) {
    let string = '';
    function preOrderTraversal(t) {
        string += t.val;
        if (t.left !== null) {
            string += '(';
            preOrderTraversal(t.left);
            string += ')';
        }
        if (t.right !== null) {
            if (t.left === null) {
                string += '()';
            }
            string += '(';
            preOrderTraversal(t.right);
            string += ')';
        }
    }
    if (t !== null) {
        preOrderTraversal(t);
    }
    return string;
};