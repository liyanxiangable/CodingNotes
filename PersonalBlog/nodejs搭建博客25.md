---
title: nodejs搭建博客25
date: 2017-05-05 15:37:30
tags:
---


现在要做的是information这一栏，这一栏逻辑上较为简单。我想把这一栏做的好看一点，在我名字这里，以我名字为中间线，上半部分为黑底白字，下边的还是原样。我本想把一个字变成两种颜色这种很有视觉冲击力的样式，但是查了一下没法实现。感觉只能做图片（或者canvas？）。另外我还想有一个头像。这种修饰的过程最麻烦，感觉怎么弄都不好看，反复写反复删，半天也没弄出什么来。然后我又插入了网易云音乐的外链。总之修饰好麻烦，先把功能实现再弄这里把。

还有一点就是我们之前的changeblog的点击，是刷新了整个页面，这样不好，但是我一直没有改。现在我想改一下。我想让他变成不刷新，只是局部的有变化，这样就不会影响到左侧的内容了。之前的blog的逻辑是，先展示文章的前200个字，然后用户点击的时候再进行ajax请求，获取到**经过markdown解析之后的html字符串**再传回到前端，这样前端把html字符串直接插入进文章区域，就可以显示出带格式的blog。现在我想可以这个样，我们做changeblog请求的时候，服务器就不render了，而是传回一组响应的数据，包括各个文章的摘要、标题、时间、页数等我们所有之前渲染新页面时需要的数据。然后发送给前端。这样我们在前端进行解析，把他们替换掉原有的内容。从而做到不用全局刷新，不会干扰到左侧内容。

要修改之前的做法，我们从头开始看。首先用户点击prevblogs或者moreblogs发送请求。这里我当时由于就是采用的页面刷新的做法，所以没有使用ajax请求。现在我们需要修改成ajax发送请求。

    $moreBlogs.on('click', function (event) {
        var pages = Number($(this).attr('data-pages').substring(5));
        $.ajax({
            type: 'POST',
            url: '/changeblog',
            data: {
                pages: pages,
                direction: 'next'
            },
            success: function (result) {
                console.log(result);
            }
        });
    });
我们暂时先这样发送请求，之后还可以与对应的prevBlogs的点击抽象成一个函数，判断点击之后到底是向后翻页还是向前翻页。这样的话我们与之对应的服务器端接收到请求之后就不要重新渲染页面，而是返回数据。不然ajax异步请求的回调函数可能还没有完成，页面就已经刷新了函数的执行也就被打断了。所以把后端的render改为json函数。

现在我们点击moreblogs，打开开发者工具。可以看到preview中已经有了后端发送的数据。

![](http://i.imgur.com/lXWRP6w.png)

下面要做的就是在前端解析这些数据，并且用这些数据替换之前的数据已达到更新效果。先来看一下都需要替换哪些数据，我们现在只关心与右侧博客内容有关的数据，其他的先不用管。首先是lastpage，这个参数之前是在pug模板中决定moreblogs要不要渲染出来的一个参数，然而现在既然我们不再重新渲染页面，也就必须渲染（不一定是一开始就渲染）moreblogs与prevblogs按钮，所以在这里pug模板中的按钮的渲染条件可以去掉了，但是由于一开始展示的是第一页，我们就把prevblogs在css中display:none，等到点击moreblogs请求更多内容的时候根据返回的数据来判断是否对他显示。然后利用lastpage这个参数与当前的页数进行判断来决定是否要显示这两个按钮。当前页数在moreblogs或者是在prevblogs按钮上的属性之中，而我们在发送请求的时候，就已经把这个当前的页数发送出去并且在后端经过处理又返回了前端，就是下面的pages参数。我们也可以在后端进行判断，但是我觉得让前端页面知道当前与总共的页数利于将来的程序的扩展。所以我在这里在前端进行puges与lastpage的判断。如果相等，就不显示moreblogs。prevblogs同理。下面是修改的ajax请求的回调函数部分内容：

    success: function (result) {
        if (result.lastPage === result.pages) {
            $moreBlogs.hide();
        }
        if (result.pages !== 1) {
            $prevBlogs.show();
        }
    }

发现了一个问题，prevblogs这个对象show了之后，我们往前翻页到第一页时，这个按钮理论上还会显示。所以增加判断：

    if (result.pages === 1) {
        $prevBlogs.hide();
    }

然后就是传回来的blogs对象数组。我先对他进行遍历，取得他的标题、分类、时间、内容等信息。

    success: function (result) {
		......
        for (var index = 0; index < result.blogs.length; index++) {
            var dataTitle = result.blogs[index].title;
            var title = dataTitle.split('_').pop().split('.').shift();
            var category = result.blogs[index].category;
            var showTime = result.blogs[index].showTime;
            var content = result.blogs[index].content;
        }
    }

这样就获取到了替换现有的元素的全部数据。下面我们对照着pug模板，把所有的有参数的地方全都进行替换：

![](http://i.imgur.com/YeoT0VO.png)

首先是blog-item的属性：

    $blogItem.attr({
        'data-title': dataTitle,
        'data-index': index,
        'id': 'blog-item' + index
    });

然后是h2与.detail，这里不要加索引，虽然返回的是一个集合：

    $blogItem.children('h2').html(title);
    $blogItem.find('.category').html('标签：' + category);
    $blogItem.find('.date').html(showTime);

然后是p.main-body：

    $mainBody = $blogItem.children('.main-body');
    $mainBody.attr('id', 'insertP' + index);
    $mainBody.html(content + '<span class="suspension">......</span>');

最后是.close-content：

    $closeContent = $blogItem.children('.close-content');
    $closeContent.children('a').attr( 'href', '#blog-item' + index);

最最后是.change-blogs：

    $changeBlogs.attr('data-pages', 'pages' + pages);

这样大体就做好了，我们需要改的地方就是不要一次发送整篇文章的数据，而是在后端发一个前200字的引言（前言？不知道这个叫什么）。然后就是把prevblogs与moreblogs发出的请求进行抽象成一个函数。抽象成的函数如下。

    $changeBlogs.on('click', function (event) {
        var pages = Number($(this).attr('data-pages').substring(5));
        var direction = null;
        if ($(this).attr('id') === 'prev-blogs') {
            direction = 'prev';
        } else if ($(this).attr('id') === 'more-blogs') {
            direction = 'next'
        }
        $.ajax({
            type: 'POST',
            url: '/changeblog',
            data: {
                pages: pages,
                direction: direction
            },
            success: function (result) {
                console.log(result);
                if (result.lastPage === result.pages) {
                    $moreBlogs.hide();
                }
                if (result.pages !== 1) {
                    alert('tatatatata');
                    //$prevBlogs.css('display', 'block');
                    $prevBlogs.show();
                }
                if (result.pages === 1) {
                    $prevBlogs.hide();
                }
                for (var index = 0; index < result.blogs.length; index++) {
                    var dataTitle = result.blogs[index].title;
                    var title = dataTitle.split('_').pop().split('.').shift();
                    var category = result.blogs[index].category;
                    var showTime = result.blogs[index].showTime;
                    var content = result.blogs[index].content;
                    var resultPages = result.pages;
                    var blogItem = document.getElementById('blog-item' + index);
                    var $blogItem = $(blogItem);
                    $blogItem.attr({
                        'data-title': dataTitle,
                        'data-index': index,
                        'id': 'blog-item' + index
                    });
                    $blogItem.children('h2').html(title);
                    $blogItem.find('.category').html('标签：' + category);
                    $blogItem.find('.date').html(showTime);
                    $mainBody = $blogItem.children('.main-body');
                    $mainBody.attr('id', 'insertP' + index);
                    $mainBody.html(content + '<span class="suspension">......</span>');
                    $closeContent = $blogItem.children('.close-content');
                    $closeContent.children('a').attr( 'href', '#blog-item' + index);
                    $changeBlogs.attr('data-pages', 'pages' + resultPages);
                }
            }
        });
    });

对于发送前200个字符，我们在后端的发送数据之前添加代码：

    for (var i = 0; i < blogs.length; i++) {
        blogs[i].content = blogs[i].content.substring(0, 200);
    }

另外我们发现点击了翻页的时候，我们的窗口的位置还是在最下边（点击moreblogs的情况，点击prevblogs则好些），所以添加锚记，使得点击翻页的时候回到最上方。但是我发现效果不是很好，可能是因为同时需要发送请求而且更换页面的原因吧。需要再看一下，另外发现有两个问题。就是我们的博客不是页面博客列表的整数倍的时候，当翻到最后一页的时候，会有之前遗漏的博客在下面没有被替换，另外就是翻到最后一页之后，moreblogs按钮被隐藏，这时候往前翻页也没有moreblogs了。
第二个问题确实是我之前没有想清楚，稍微修改页数判断即可：

    if (resultPages !== result.lastPage) {
        $moreBlogs.show();
    } else {
        $moreBlogs.hide();
    }
    if (resultPages !== 1) {
        $prevBlogs.show();
    } else {
        $prevBlogs.hide();
    }

对于第一个问题，我们在遍历的时候，要对博客列表是否（可以）被进行判断。如果没有，则让他清空。不对，写了会代码发现，不能让他删除或者清空，否则再向前翻页的时候（这时候一定是一整张满的博客列表）就没有办法进行替换了。所以这时候先让他hide。一开始是删掉了列表中的条目，但是发现我们还有head-bar，所以也要把head-bar删掉。

    var length = result.blogs.length;
    var itemLength = $('.blog-item').length;
    if (resultPages !== result.lastPage) {
        $moreBlogs.show();
    } else {
        $moreBlogs.hide();
        for (var i = 0; i < itemLength - length; i++) {
            var $deletItem = $('.blog-item:last');
            $deletItem.prev().hide();
            $deletItem.hide();
        }
    }

大功告成！

参考链接：

1. [http://www.w3school.com.cn/cssref/pr_box-shadow.asp](http://www.w3school.com.cn/cssref/pr_box-shadow.asp)
2. [http://blog.csdn.net/u010433704/article/details/51094781](http://blog.csdn.net/u010433704/article/details/51094781)
3. [http://www.cnblogs.com/RitaLee/p/5944511.html](http://www.cnblogs.com/RitaLee/p/5944511.html)
4. [http://blog.csdn.net/java_pp/article/details/8181879](http://blog.csdn.net/java_pp/article/details/8181879)
5. [http://www.cnblogs.com/mitang/p/3999099.html](http://www.cnblogs.com/mitang/p/3999099.html)
6. [http://www.cnblogs.com/liwe/p/4884614.html](http://www.cnblogs.com/liwe/p/4884614.html)
7. [http://blog.csdn.net/silianlinyi/article/details/7768580](http://blog.csdn.net/silianlinyi/article/details/7768580)