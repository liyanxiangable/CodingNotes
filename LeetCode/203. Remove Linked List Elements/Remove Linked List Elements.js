/**
 * Created by liyanxiang on 2017/9/12.
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
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
    if (!head) return head;
    // 去除头部的相应元素
    let valid = head;
    while (valid.val === val) {
        valid = valid.next;
    }
    // 去除中间或者尾部的相应元素
    let back = valid;
    let front = back.next;
    while (front) {
        if (front.val === val) {
            back.next = front.next;
        } else {
            back = back.next;
        }
        front = front.next;
    }
    return valid;
};