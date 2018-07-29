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
 * @return {TreeNode}
 */

// 层次遍历方法
/*
var invertTree = function(root) {
    let nodes = [];
    if (root) {
        nodes = [root];
    }
    let num  = 0;
    while (nodes.length) {
        num = nodes.length;
        while (num--) {
            let popNode = nodes.shift();
            if (popNode.left || popNode.right) {
                swapChild(popNode);
            }
            if (popNode.left) nodes.push(popNode.left);
            if (popNode.right) nodes.push(popNode.right);
        }
    }
    return root;
};

function swapChild(node) {
    if (node.left === null) {
        node.left = node.right;
        node.right = null;
    } else if (node.right === null) {
        node.right = node.left;
        node.left = null;
    } else {
        let tempNode = node.left;
        node.left = node.right;
        node.right = tempNode;
    }
}

*/


// 递归方法，采用先序遍历

var invertTree = function(root) {
    preOrderTraversal(root);
    return root;
};

function preOrderTraversal(node) {
    if (node) {
        swapChild(node);
        preOrderTraversal(node.left);
        preOrderTraversal(node.right)
    }
}

function swapChild(node) {
    if (node.left === null) {
        node.left = node.right;
        node.right = null;
    } else if (node.right === null) {
        node.right = node.left;
        node.left = null;
    } else {
        let tempNode = node.left;
        node.left = node.right;
        node.right = tempNode;
    }
}