/**
 * Created by liyanxiang on 2017/8/25.
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
    if (head === null) return head;
    let currentNode = head;
    // 不断遍历直到最后
    while (currentNode.next) {
        // 判断当前的结点值域是否与下一个结点值域相等
        if (currentNode.val === currentNode.next.val) {
            let nextValid = currentNode.next;
            // 判断是否之后的还是重复数字。如果是，就一直向后知道不重复
            while (nextValid.val === currentNode.val) {
                // 还要结尾判断
                if (nextValid.next) {
                    nextValid = nextValid.next;
                } else {
                    currentNode.next = null;
                    break;
                }
            }
            if (currentNode.next) {
                currentNode.next = nextValid;
            } else {
                break;
            }
        }
        currentNode = currentNode.next;
    }
    return head;
};