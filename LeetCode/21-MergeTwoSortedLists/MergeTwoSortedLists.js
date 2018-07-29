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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
    if (l1 === null) {
        return l2;
    }
    if (l2 === null) {
        return l1;
    }
    let newList = new ListNode();
    if (l1.val > l2.val) {
        newList.val = l2.val;
        newList.next = mergeTwoLists(l1, l2.next);
    } else {
        newList.val = l1.val;
        newList.next = mergeTwoLists(l1.next, l2);
    }
    return newList;
};