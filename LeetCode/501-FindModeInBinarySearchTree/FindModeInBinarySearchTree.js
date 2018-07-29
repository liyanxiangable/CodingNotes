/**
 * Created by liyanxiang on 2017/8/29.
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
 * @return {number[]}
 */
var findMode = function(root) {
    let map = new Map();
    (function inOrderTraversal(root) {
        if (root) {
            inOrderTraversal(root.left);
            if (map.has(root.val)) {
                let times = map.get(root.val);
                map.set(root.val, ++times);
            } else {
                map.set(root.val, 1);
            }
            inOrderTraversal(root.right);
        }
    })(root);
    let maxTimes = 0;
    for (let value of map.values()) {
        if (value > maxTimes) {
            maxTimes = value;
        }
    }
    let modes = [];
    map.forEach((value, key) => {
        if (value === maxTimes) {
            modes.push(key);
        }
    });
    return modes;
};