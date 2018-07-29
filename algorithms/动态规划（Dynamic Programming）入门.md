# 动态规划（Dynamic Programming）入门



## 简介

### 什么是动态规划（DP）

动态规划是把复杂的最优解问题拆分成简单的子问题，并且存储每个子问题的解来使每个子问题都只求解一次。

### 解决 DP 问题的步骤

1. 确定子问题
2. 记录相关联子问题的重叠
3. 找出并解决基本情形



## 一维 DP 实例

### 例 1. 给出数字 n，找出多少种 n 以 1、3、4 这三个数相加运算为和的计算方式

例如 n = 5，那么结果即为 6：

```
5	= 1 + 1 + 1 + 1 + 1
	= 1 + 1 + 3
	= 1 + 3 + 1
	= 3 + 1 + 1
	= 1 + 4
	= 4 + 1
```

1. 定义子问题

   设 D(n) 为 1、3、4 组成 n 的不同方法

2. 找出子问题重叠

   假设 n = x1 + x2 + ...... + xm；

   如果 xm = 1，那么剩下的元素之和只能是 n - 1；

   即如果以 1 作为最后一个加数，那么此时的问题就是求 D(n - 1)；

   然后再以同样的方式考虑 xm = 3 与 xm = 4；

   所以子问题的重叠在于：D(n) = D(n - 1) + D(n - 3) + D(n - 4)；

3. 找出并解决最基本的情形

   D(0) = 0; D(1) = 1; D(2) = 1; D(3) = 2;

程序如下：

```java
public class SumWays {
  static int count = 0;
  public static void main(String[] args) {
    SumWays sumWays = new SumWays();
    System.out.println(sumWay.countWays(40));
    System.out.println("count : " + count);
  }

  private int countWays(int sum) {
    count++;
    if (sum < 0) {
      return 0;
    } else if (sum == 0) {
      return 1;
    } else if (sum == 1) {
      return 1;
    } else if (sum == 2) {
      return 1;
    } else if (sum == 3) {
      return 2;
    } else {
      return countWays(sum - 1) + countWays(sum - 3) + countWays(sum - 4);
    }
  }
}
```

当 n = 40 时，可以看到函数总共被调用了 137295676 次！



### 例 2. 给出数字 n，找出有多少种可以使用多米诺骨牌来填满 3 * n 的长方形。

例如 n = 12 时，有一种解法：

![](https://i.imgur.com/4IiXwdD.png)

1. 定义子问题

   设 D(n) 为 长度为 n 时不同的排列方式

2. 找出子问题重叠

   假设对于长度 n 的长方形的多米诺骨牌放置排列，有

   一种情况是三个骨牌横向放置，此时它之前的排列方式记为 D(n - 2)；

   一种情况是一个骨牌横向放置，另外有一个骨牌纵向放置。对于横向放置的骨牌在上方还是下方，位置虽然不同但是是等效的。所以记为 A(n - 1) * 2。

3. 找出并解决最基本的情形

   D(0) = 0; D(1) = 1; D(2) = 1; D(3) = 2;
   ​

































































## 参考与感谢