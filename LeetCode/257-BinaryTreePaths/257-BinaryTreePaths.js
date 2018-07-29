/**
 * Created by liyanxiang on 2017/8/28.
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
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    let strArr = [];
    let string = '';
    preOrder2String(root, string, strArr);
    return strArr;
};

var preOrder2String = function(root, string, strArr) {
    if (root) {
        if (root.left === null && root.right === null) {
            string += root.val
            strArr.push(string);
            return;
        }
        string += root.val + '->';
        preOrder2String(root.left, string, strArr);
        preOrder2String(root.right, string, strArr);
    }
};