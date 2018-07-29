/**
 * Created by liyanxiang on 2017/8/29.
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
/*
var hasCycle = function(head) {
    let set = new Set();
    while (head) {
        if (set.has(head)) {
            return true;
        } else {
            set.add(head);
        }
        head = head.next;
    }
    return false;
};
*/
var hasCycle = function(head) {
    if (head === null) {
        return false;
    }
    let walker = runner = head;
    while (walker.next && runner.next && runner.next.next) {
        walker = walker.next;
        runner = runner.next.next;
        if (walker === runner) {
            return true;
        }
    }
    return false;
};