/**
 * Created by liyanxiang on 2017/8/21.
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
/*
var reverseList = function(head) {
    if (head === null) {
        return null;
    }
    let nodes = [];
    while (head) {
        nodes.push(head);
        head = head.next;
    }
    let len = nodes.length;
    while (len-- > 1) {
        nodes[len].next = nodes[len - 1];
    }
    nodes[0].next = null;
    return nodes[nodes.length - 1];
};
*/

var reverseList = function(head) {
    let prev = null, cur = null, next = null;
    let reverse = null;
    cur = head;
    while (cur) {
        next = cur.next;
        if (next === null) {
            reverse = cur;
        }
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return reverse;
};