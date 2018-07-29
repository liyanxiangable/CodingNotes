---
title: LeetCode-习题笔记39-MinimumIndexSumOfTwoLists
date: 2017-08-21 09:54:34
tags:
---


Suppose Andy and Doris want to choose a restaurant for dinner, and they both have a list of favorite restaurants represented by strings.

You need to help them find out their common interest with the least list index sum. If there is a choice tie between answers, output all of them with no order requirement. You could assume there always exists an answer.

Example 1:
Input:
["Shogun", "Tapioca Express", "Burger King", "KFC"]
["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"]
Output: ["Shogun"]
Explanation: The only restaurant they both like is "Shogun".
Example 2:
Input:
["Shogun", "Tapioca Express", "Burger King", "KFC"]
["KFC", "Shogun", "Burger King"]
Output: ["Shogun"]
Explanation: The restaurant they both like and have the least index sum is "Shogun" with index sum 1 (0+1).
Note:
The length of both lists will be in the range of [1, 1000].
The length of strings in both lists will be in the range of [1, 30].
The index is starting from 0 to the list length minus 1.
No duplicates in both lists.



	var findRestaurant = function(list1, list2) {
	    let common = [];
	    let newList1 = [], newList2 = [];
	    list1.forEach((restaurant, index) => {
	        newList1.push({name: restaurant, ranking: index});
	    });
	    list2.forEach((restaurant, index) => {
	        newList2.push({name: restaurant, ranking: index});
	    });
	    newList1.forEach(item1 => {
	        for (let item2 of newList2) {
	            if (item1.name === item2.name) {
	                common.push({name: item2.name, ranking: item2.ranking + item1.ranking});
	            }
	        }
	    });
	    common.sort(function (a, b) { return a.ranking - b.ranking });
	    let someName = [];
	    for (let item of common) {
	        if (item.ranking === common[0].ranking) {
	            someName.push(item.name);
	        } else {
	            break;
	        }
	    }
	    return someName;
	};