/**
 * Created by liyanxiang on 2017/8/19.
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
 * @param {number} k
 * @return {boolean}
 */
var findTarget = function(root, k) {
    let sortArray = inOrderTraversal(root);
    function inOrderTraversal(root) {
        if (root !== null) {
            inOrderTraversal(root.left);
            sortArray.push(root);
            inOrderTraversal(root.right);
        }
    }
    console.log(sortArray);
    let start = 0, end = sortArray.length - 1;
    if (k < sortArray[start]) {
        return false;
    } else {
        while (start < end) {
            if (sortArray[start] + sortArray[end] < k) {
                start++;
            } else if (sortArray[start + sortArray[end] > k]) {
                end--;
            } else if (sortArray[start] + sortArray[end] === k) {
                return true;
            }
        }
        return false;
    }
};

