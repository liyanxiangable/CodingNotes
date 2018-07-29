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
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    let a = headA, b = headB;
    while (a !== b) {
        if (a !== null) {
            a = a.next;
        } else {
            a = headB;
        }
        if (b !== null) {
            b = b.next;
        } else {
            b = headA;
        }
    }
    return a;
};