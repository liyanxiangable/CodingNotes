/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
 */
/**
 * @param {TreeNode} t1
 * @param {TreeNode} t2
 * @return {TreeNode}
 */
var mergeTrees = function(t1, t2) {
    var newNode;
    if (t1 === null) {
        return newNode = t2;
    }
    if (t2 === null) {
        return newNode = t1;
    }
    newNode = new TreeNode(t1.val + t2.val);
    if (t1.left || t2.left) {
        newNode.left = mergeTrees(t1.left, t2.left);
    }
    if (t1.right || t2.right) {
        newNode.right = mergeTrees(t1.right, t2.right);
    }
    return newNode;
};