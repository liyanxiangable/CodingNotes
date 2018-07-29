/**
 * Created by liyanxiang on 2017/8/22.
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
var diameterOfBinaryTree = function(root) {
    // current为穿过当前节点的直径，left与right为左右子树的直径
    let current;
    // 通过遍历来求得做右子树的深度，如果当前节点为空。此时返回直径0
    if (root === null) {
        return 0;
    }
    let leftDepth = getDepth(root.left);
    let rightDepth = getDepth(root.right);
    current = leftDepth + rightDepth;
    // 比较左右子树的直径，再与穿过当前节点的直径比较，
    // 其中最大值为以当前节点为根节点的整棵树的直径，其中做右子树的直径是由递归本函数得到
    let diameter = Math.max(current, Math.max(diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right)));
    return diameter;
};

function getDepth(root) {
    // 如果root已经不是节点，说明遍历到头了，返回1
    if (root === null) {
        return 0
    } else {
        // 如果root还有子树可以继续遍历。那就将深度增加一层，
        // 并且继续寻找当前节点的左右子树的深度的较大值
        return 1 + Math.max(getDepth(root.left), getDepth(root.right))
    }
}

