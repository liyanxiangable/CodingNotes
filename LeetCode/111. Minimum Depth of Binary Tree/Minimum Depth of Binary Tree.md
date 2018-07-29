111. Minimum Depth of Binary Tree

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.



这个题考察的有递归，二叉树的遍历，以及遍历的边界条件。感觉自己的基础知识还是不牢固，尤其是递归的思想还是比较模糊。我写出来的代码是这个样的，虽然也提交成功了：

```JavaScript
var minDepth = function(root) {
    if (root === null) return 0;
    let left, right;
    if (root.left === null && root.right === null) {
        return 1;
    }
    if (root.left) {
        left = minDepth(root.left);
    } else {
        left = Infinity;
    }
    if (root.right) {
        right = minDepth(root.right);
    } else {
        right = Infinity;
    }
    return 1 + Math.min(left, right);
};
```
但是总感觉哪里很啰嗦。主要是其中的边界条件感觉很罗嗦，不然的话就是我写的方法有问题。我是想不断对子节点进行递归，然是与“传统”的先序遍历不同的是，不是判断当前的root是否为空，因为我们求深度的话，每次找到子节点，就将深度加1再进行递归。当遍历到叶子节点的时候，返回1，代表这个叶子结点的一层。然后有一点需要注意的是对于度为1的节点，这种节点显然不是叶子结点，但是他只有一个孩子，另一个孩子为空。这也就是为什么不是像传统遍历的时候对当前节点进行判断，而是对叶子节点进行判断。由于是求最小的深度，所以对孩子为空的时候，此时不是一个路径的端点，但是路径分支又在这里结束了，所以可以将深度设置为无限大。最后有一个对root是否为空的判断，这个看起来是与刚才所说的不判断root为空相悖，但是这个实际上只是在第一层有用，就是判断根节点是否为空的边界条件。