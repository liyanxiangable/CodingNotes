Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.



我的想法是对树进行先序遍历，然后不断递归求出左右两棵子树的深度，并返回较小值。

而且这个题是有争议的，我在提交代码的时候也遇到了讨论区中的问题[单子树的时候深度为n而不为1](https://discuss.leetcode.com/category/119/minimum-depth-of-binary-tree)，但是如果只有一个节点的时候深度又为1。不过下边的评论也说了，是到叶子结点的距离，就是说度为0的节点，这样的话就可以说的通了。

就是从根节点开始，进行递归，每递归一个子节点深度就自增，然后比较左右递归而得到的深度。取较小的深度返回。当遍历到叶子节点的时候对深度进行返回，叶子结点本身的深度为1。

