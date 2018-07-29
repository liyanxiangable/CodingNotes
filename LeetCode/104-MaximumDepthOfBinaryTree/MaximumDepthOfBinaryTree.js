/**
 * Created by liyanxiang on 2017/8/15.
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
var maxDepth = function(root) {
    // 用一数列来储存当前层次的结点, 默认初始化为根节点，并且还要判断根节点是否为空
    if (root === null) {
        return 0;
    }
    let nodes = [root];
    let depth = 0;
    // 循环进行层次的遍历，直到结点数组中不再有结点表示整棵树遍历完成
    while (nodes.length) {
        // 对当前层次的结点进行遍历，每进行一次遍历深度增加1
        // 遍历到一个结点。就将结点移除，并添加他的子结点
        let length = nodes.length;
        while (length--) {
            // 另外需要注意的是元素从数组的一端出，另一端进入。这样才能正确遍历。
            let node = nodes.shift();
            if (node.left) nodes.push(node.left);
            if (node.right) nodes.push(node.right);
        }
        depth++;
    }
    return depth;
};