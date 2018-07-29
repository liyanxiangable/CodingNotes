---
title: LeetCode-习题笔记11-IslandPerimeter
date: 2017-08-14 09:56:05
tags:
---


You are given a map in form of a two-dimensional integer grid where 1 represents land and 0 represents water. Grid cells are connected horizontally/vertically (not diagonally). The grid is completely surrounded by water, and there is exactly one island (i.e., one or more connected land cells). The island doesn't have "lakes" (water inside that isn't connected to the water around the island). One cell is a square with side length 1. The grid is rectangular, width and height don't exceed 100. Determine the perimeter of the island.

给你一个地图，是以0与1构成的二维矩阵表示的。其中1代表陆地，0代表水面。地图网格是水平、垂直链接的。网格是完全被水包围的（意思是如果陆地接触到地图的边界，那么也是算被水包围着），并且有且只有一片陆地。陆地中并没有水域。每个小格都是边长为1的四边形。整个网格是一个矩形，长与宽不超过100。现在要测定陆地的边界。


Example:

[[0,1,0,0],
 [1,1,1,0],
 [0,1,0,0],
 [1,1,0,0]]

Answer: 16
Explanation: The perimeter is the 16 yellow stripes in the image below:
[https://leetcode.com/static/images/problemset/island.png](https://leetcode.com/static/images/problemset/island.png)

这个题我没想出什么简单的算法，就是先获得所有陆地的坐标，然后检查他们是否有相邻的位置。如果有，那么每一个相邻的位置都要减去两个单位长度的周长。p = 4 * n - 2 * m，其中n为陆地小格的个数，m为相邻的边数。
首先遍历一遍整个的地图，得到一个陆地位置的集合或者数组，这样就得到了n。注意位置有两部分组成，一是横坐标、二是纵坐标。
然后就是得到重合（相邻）边数m，其中m可以分解成 m = x + y，即总的重合的边数等于横坐标重合的边数与纵坐标重合的边数。那么要想获得x与y，也是对坐标进行遍历，比如说获得纵向的相邻边数，那么就对横坐标进行遍历，看纵坐标位置相差1的坐标有几个。我觉得这里还可以先对纵坐标进行排序，以方便进行遍历。
最终得到x与y就可以计算周长。
另外补充一点就是排序的话可以根据不同的对象属性（数组也是一个对象，数组的索引就是对应对象的属性）进行排序，原理都是一样的。如果遇到 某一个横（纵）坐标的陆地的小格子数量为1，那么他肯定没有相邻的边，这个可以优化，但是我不想写了。
最后发现一点就是在收集陆地坐标的时候，由于是按照从行到列的顺序进行循环遍历，所以我们得到的数组本来就是由纵坐标从小到大排列好的，这样可以省去一次排列的时间。
然后发现有个地方考虑的不仔细，就是在进行排列的时候，有可能虽然两个陆地的坐标是相邻的，但是却在数组中不相邻。由于代码检测的是数组中相邻元素，这样的话就不会算作地理位置相邻。这样的话还应当在排序中添加辅助的排序规则。

最终结果如下：
	/**
	 * @param {number[][]} grid
	 * @return {number}
	 */
	var islandPerimeter = function(grid) {
	    // 计算陆地小格数量，收集陆地坐标
	    let land = [];
	    for (let i = 0; i < grid.length; i++) {
	        for (let j = 0; j < grid[0].length; j++) {
	            if (grid[i][j] === 1) {
	                land.push([i,j]);
	            }
	        }
	    }
	    n = land.length;
	    console.log(land);
	
	    let m = 0;
	    // 收集的位置本身就是根据纵坐标排列好的，因此不必再排序
	    for (let i = 0; i < n - 1; i++) {
	        // 如果坐标与他相邻位置（）的坐标的纵坐标相同，且横坐标只相差1个单位
	        // 那么就说明两陆地小格相邻
	        if (land[i][0] === land[i + 1][0] && Math.abs(land[i][1] - land[i + 1][1]) === 1) {
	            m++;
	        }
	    }
	
	    // 根据横轴坐标进行排序
	    land.sort(function (a, b) {
	        if (a[1] > b[1]) {
	            return 1;
	        } else if (a[1] < b[1]) {
	            return -1;
	        } else if (a[1] === b[1]) {
	            //如果第一潘旭条件为相等的话，则使用 第二排序规则
	            return a[0] - b[0];
	        }
	    });
	    // 遍历整个排序后的坐标
	    for (let i = 0; i < n - 1; i++) {
	        // 如果坐标与他相邻位置（）的坐标的横坐标相同，且纵坐标只相差1个单位
	        // 那么就说明两陆地小格相邻
	        if (land[i][1] === land[i + 1][1] && Math.abs(land[i][0] - land[i + 1][0]) === 1) {
	            m++;
	        }
	    }
	
	    return 4 * n - 2 * m;
	};

这个算法的效率不高，我做完了题才想起，可以直接对地图进行遍历。一边遍历一边判断当前的坐标的边是否有重复，这样就不用之后的两次对位置的循环遍历判断，效率应该会提升不少。现在我懒得写了，等回头如果再做这一题的话，使用这种方法吧。

参考链接：

1. [https://leetcode.com/problems/island-perimeter/description/](https://leetcode.com/problems/island-perimeter/description/)
2. [http://www.jianshu.com/p/90b6fd039bfd](http://www.jianshu.com/p/90b6fd039bfd)
3. [http://blog.csdn.net/ccplzll/article/details/54137309](http://blog.csdn.net/ccplzll/article/details/54137309)


