---
title: LeetCode-习题笔记7-DistributeCandies
date: 2017-08-13 10:29:52
tags:
---


Given an integer array with even length, where different numbers in this array represent different kinds of candies. Each number means one candy of the corresponding kind. You need to distribute these candies equally in number to brother and sister. Return the maximum number of kinds of candies the sister could gain.

给出一偶数长度的整数数组，数组中不同的数组代表不同种类的糖果。每个数字表示一个糖果对应的种类。你需要将这些糖果在数值上均等的分给姐姐与弟弟。返回姐姐可以得到的糖果种类的最大值。
注意给出的数组长度范围是[2, 10000]，并且长度为偶数。


Example 1:
Input: candies = [1,1,2,2,3,3]
Output: 3
Explanation:
There are three different kinds of candies (1, 2 and 3), and two candies for each kind.
Optimal distribution: The sister has candies [1,2,3] and the brother has candies [1,2,3], too. 
The sister has three different kinds of candies. 
Example 2:
Input: candies = [1,1,2,3]
Output: 2
Explanation: For example, the sister has candies [2,3] and the brother has candies [1,1]. 
The sister has two different kinds of candies, the brother has only one kind of candies. 
Note:

The length of the given array is in range [2, 10,000], and will be even.
The number in given array is in range [-100,000, 100,000].




一开始题都没有看懂，看了例子才知道有且只有两个孩子，把不同种类的糖果分成均等的两部分。返回其中种类最多的分配方案的种类数目。
假设数组的长度为2n，那么糖果的种类最小为1，最大为2n。对于姐姐要尽可能多的得到糖果的种类，最大值也不会超过n。所以我的想法就是在数组中挑选不同种类的糖果n次，直到边界条件停止。
边界条件有两种，一是一直可以把糖果分给姐姐，直到分了n个糖果，数组还没有遍历完，这个时候显然最大值为n；另一种是不断进行挑选，结果遍历完了所有的数组元素也只有m种糖果，还没有达到n次，这种情况的最大值显然为m。
相对于在2n长度的数组中进行选择，我更倾向于先将给出的长度为2n数组去重，将数组简化成一个没有重复元素的数组，然后与n比较，如果比n大，那结果就是n；如果比n小，那就是数组去重之后的长度。
那么怎么给数组去重呢？创建一个新的数组，储存没有重复的元素，并循环进行比对。
以下是我的做法：
	var distributeCandies = function(candies) {
	    let eliminate = [candies[1]];
	    for (let candy of candies) {
	        // 设置一个表示去重之后的数组中没有当前遍历到的糖果的标志位
	        let hasThisCandy = false;
	        for (let item of eliminate) {
	            if (candy === item) {
	                hasThisCandy = true;
	                break;
	            }
	        }
	        if (!hasThisCandy) {
	            eliminate.push(candy);
	        }
	    }
	    console.log(eliminate);
	    return eliminate.length > candies.length / 2 ? candies.length / 2 : eliminate.length;
	};
然后我提交代码的时候报错是运行超时。然后我找到了一个答案，链接在最下面：
	var distributeCandies = function(candies) {
	    return Math.min(new Set(candies).size, candies.length / 2);
	};
用了set集合，还有这种操作？我以前好像记得js中没有这些集合等数据结构。涨姿势了，这是ES6中的新语法。并且他这种写法不同于我自己写的比较大小，而是使用了Math的min方法。虽然思想是一样的，然是官方的数据结构与方法比我自己实现的效率高很多。





参考链接：

1. [https://discuss.leetcode.com/topic/88537/1-line-javascript-o-n-solution-using-set](https://discuss.leetcode.com/topic/88537/1-line-javascript-o-n-solution-using-set)
2. [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)