---
title: LeetCode-习题笔记52-NumberOfBoomerangs
date: 2017-08-22 14:03:45
tags:
---


Given n points in the plane that are all pairwise distinct, a "boomerang" is a tuple of points (i, j, k) such that the distance between i and j equals the distance between i and k (the order of the tuple matters).

Find the number of boomerangs. You may assume that n will be at most 500 and coordinates of points are all in the range [-10000, 10000] (inclusive).

Example:
Input:
[[0,0],[1,0],[2,0]]

Output:
2

Explanation:
The two boomerangs are [[1,0],[0,0],[2,0]] and [[1,0],[2,0],[0,0]]


	var numberOfBoomerangs = function(points) {
	    let bNum = 0;
	    for (let i = 0; i < points.length; i++) {
	        let distances = {};
	        for (let p = 0; p < points.length; p++) {
	            if (p !== i) {
	                let distance = Math.pow(Math.abs(points[i][0] - points[p][0]), 2) +
	                    Math.pow(Math.abs(points[i][1] - points[p][1]), 2);
	                if (typeof distances[distance] !== 'undefined') {
	                    distances[distance]++;
	                } else {
	                    distances[distance] = 1;
	                }
	            }
	        }
	        for (let dist in distances) {
	            if (distances[dist] > 1) {
	                bNum += distances[dist] * (distances[dist] - 1);
	            }
	        }
	    }
	    return bNum;
	};
