/**
 * Created by liyanxiang on 2017/8/24.
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} s
 * @param {TreeNode} t
 * @return {boolean}
 */
var isSubtree = function(s, t) {
    let sString = tString =  '';
    sString = convertToString(s, sString);
    tString = convertToString(t, tString);
    return sString.indexOf(tString) !== -1;
};

function convertToString(root, string) {
    // 对于每一个元素都应当使用标志间隔
    string += ',';
    if (root !== null) {
        string += root.val;
        string = convertToString(root.left, string);
        string = convertToString(root.root, string);
    } else {
        // 当结点为空的时候，也应当答应特殊标志。才可以保证子树相同
        string += '#';
    }
    // 对于每一个元素都应当使用标志间隔
    string += ',';
    return string;
}