---
title: nodejs搭建博客22
date: 2017-05-03 22:57:38
tags:
---


现在来做点击moments展开之后的内容，我们要选前N条进行展示，然后监听鼠标滚珠向下滚动的事件，再进行加载。通过点击moments发起ajax请求，获取更多的moments。获取N条数据，就要对已经显示的moments进行忽略，所以还应该有计数。

我们想要展开之后来展示新的moments，所以之前的那一条数据我想就不显示了（之后有动画效果），可以创建一个div来盛放那一条moments以及之后的所有moments。为了方便，在容器之后再添加item，item包括图片与状态，然后这样便于多条moments的渲染。

    .left-item#moments
      .return
        | RETURN
          .moments-container
            .moments-item
              .picture
                img(src = '/pictures/' + momentPicUrl)
              .moods
                p #{momentMoods}
然后再来看后端的发送的数据是一个moments的数组，现在数组应该在pug模板进行解析然后刷新；或者也可以不刷新，进行ajax请求，在前段利用js将发送的moments动态生成html插入到dom中。之前的moreblog代码是进行刷新的，现在在moments这里尝试一下不刷新的这种方法。

这样我们要修改userFunction.js的代码，之前我们左边的点击改变视图抽象成了一个函数，但是现在由于这个函数不利于之后的ajax请求操作（也能，不过新写一个函数就几行代码，想要复用代码会在抽象的函数内要写更多的代码，有些得不偿失），所以现在要把它分成之前的样子。。。

我先将发送的moments位置的标记写为1，等之后完善。于是变成了这个样子：

    $information.on('click', function () {
        $moments.hide();
        $return.show();
        $(this).css('height', '99%');
    });

    $moments.on('click', function () {
        $information.hide();
        $return.show();
        $(this).css('height', '99%');
        $.ajax({
            type: 'POST',
            url: '/moremoments',
            data: 1,
            dataType: Array,
            success: function (moments) {
                ......
            }
        });
    });
可以看到，后端传回的是一个json对象，然后前端捕捉到了这个对象，其中的moments数组是由各个小的对象构成的，这些小的对象中有我们需要的图片的文件名与moods。我的想法是每遍历到一个元素，就动态的创建一个moments-item元素，这个元素包含moods与picture。再把这个元素插入到moments-item的的最后的元素后边。

回忆一下，创建一个元素有什么方法？可以用原生js的document.createElement，也可以用jquery直接appendTo或者insertAfter。考虑到我们要实现的操作，在这里使用insertAfter。但是这里有一个问题就是我们最开始展示的那一个moments不一定是最新的，所以我想把它在展开的时候直接去掉，但是这样我们怎么插入元素呢？看来我们不应该使用insertAfter函数，而是应该以moments-container为参照物使用原生js先createElement创建再appendChild插入元素。另外这个过程中可能要用到htmlDOM元素与jquery对象，而jquery对象不能直接使用DOM方法，所以可能要转换一下（当然也可以规避使用jquery对象）。如下：

    $moments.on('click', function () {
        $information.hide();
        $return.show();
        $(this).css('height', '99%');
        $.ajax({
            type: 'POST',
            url: '/moremoments',
            data: 1,
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.moments.length; i++) {
                    var moods = data.moments[i].moods;
                    var filename = data.moments[i].picture[0];
                    console.log('状态' + moods + filename);
                    $momentsContainer.html('');
                    var moodsDiv = document.createElement('div');
                    var moodsP = document.createElement('p');
                    var moodsText = document.createTextNode(moods);
                    var pictureDiv = document.createElement('div');
                    var pictureP = document.createElement('p');
                    var pictureText = document.createTextNode(filename);
                    var momentsItem = document.createElement('div');
                    var momentsContainer = $momentsContainer.get(0);                    moodsP.appendChild(moodsText);
                    moodsDiv.appendChild(moodsP);
                    pictureP.appendChild(pictureText);
                    pictureDiv.appendChild(pictureP);
                    momentsItem.appendChild(moodsDiv);
                    momentsItem.appendChild(pictureDiv);
                    momentsContainer.appendChild(momentsItem);
                }
            }
        });
    });

这段代码运行结果如下：

![](http://i.imgur.com/7xSsV6V.png)

可以看到，只显示了一个moments-item。但是我们在控制台监测遍历：

![](http://i.imgur.com/wwamZjy.png)

这是应为如果是没有moods或者没有picture的情况，就无法执行createTextNode方法，进而无法创建moments-item。所以我把代码进行修改，判断这两个字段是否为undefined，如果为空的话，就不需要这一部分的内容了。有个容易出现的地方就是判断undefined时，不应是字符串'undefined'，而应该是undefined类型。另外上边有个地方写错了，$momentsContainer.html('')这一句应当写到循环之外，不然每次遍历都会清空容器，之前的添加的内容就没有了。修改后的代码如下：

    success: function (data) {
        var momentsContainer = $momentsContainer.get(0);
        $momentsContainer.html('');
        for (var i = 0; i < data.moments.length; i++) {
            var moods = data.moments[i].moods;
            var filename = data.moments[i].picture[0];
            var momentsItem = document.createElement('div');
            if (typeof(filename) !== 'undefined') {
                var pictureDiv = document.createElement('div');
                var pictureP = document.createElement('p');
                var pictureText = document.createTextNode(filename);
                pictureP.appendChild(pictureText);
                pictureDiv.appendChild(pictureP);
                momentsItem.appendChild(pictureDiv);
            }
            if (typeof(moods) !== 'undefined') {
                var moodsDiv = document.createElement('div');
                var moodsP = document.createElement('p');
                var moodsText = document.createTextNode(moods);
                moodsP.appendChild(moodsText);
                moodsDiv.appendChild(moodsP);
                momentsItem.appendChild(moodsDiv);
            }
            momentsContainer.appendChild(momentsItem);
        }
    }

这样就能够显示之后的momets了。




参考链接：

1. [http://bbs.csdn.net/topics/392005478?page=1](http://bbs.csdn.net/topics/392005478?page=1)
2. [http://bbs.csdn.net/topics/390579464](http://bbs.csdn.net/topics/390579464)
3. [http://api.jquery.com/insertAfter/](http://api.jquery.com/insertAfter/)
4. [http://www.w3school.com.cn/jquery/jquery_dom_add.asp](http://www.w3school.com.cn/jquery/jquery_dom_add.asp)
5. [http://www.cnblogs.com/ajun/archive/2012/06/14/2549091.html](http://www.cnblogs.com/ajun/archive/2012/06/14/2549091.html)
6. [http://blog.csdn.net/qq_27626333/article/details/51927022](http://blog.csdn.net/qq_27626333/article/details/51927022)
7. [http://www.w3school.com.cn/jquery/manipulation_insertafter.asp](http://www.w3school.com.cn/jquery/manipulation_insertafter.asp)
8. [http://www.w3school.com.cn/jquery/manipulation_html.asp](http://www.w3school.com.cn/jquery/manipulation_html.asp)
9. [http://www.runoob.com/jsref/met-document-createelement.html](http://www.runoob.com/jsref/met-document-createelement.html)
10. [http://blog.csdn.net/ryan1214/article/details/31735513](http://blog.csdn.net/ryan1214/article/details/31735513)
11. [http://www.cnblogs.com/binaryworms/archive/2010/04/08/1707064.html](http://www.cnblogs.com/binaryworms/archive/2010/04/08/1707064.html)