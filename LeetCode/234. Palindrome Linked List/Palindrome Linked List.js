/**
 * Created by liyanxiang on 2017/9/11.
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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    // 前三个if都是边界条件，链表为空与极短的情况
    if (head === null) return true;
    let newLinkedList = null;
    let nodePointer = head;
    while (nodePointer !== null) {
        let newHeadNode = new ListNode(nodePointer.val);
        newHeadNode.next = newLinkedList;
        newLinkedList = newHeadNode;
        nodePointer = nodePointer.next;
    }
    while (head && newLinkedList) {
        if (head.val !== newLinkedList.val) {
            return false;
        }
        head = head.next;
        newLinkedList = newLinkedList.next;
    }
    return true;
};