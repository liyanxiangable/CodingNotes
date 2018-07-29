---
title: nodejs搭建博客24
date: 2017-05-04 21:11:49
tags:
---


之前的滚轮滚动加载很漂亮，但是也发现了两个问题，就是内容加载了，但却不是新的moments，而是循环之前的moments。检查一下，发现这是因为之前的坑没有填，就是我们ajax发送的data是1，并不是动态的offset。当第一次的时候，我们后端返回了offset，我们在前端收到这个数据，现在应该把他作为一个属性（的一部分）放到moreMoments上。然后发送请求的时候在把offset的值从属性上取下来传到后端。这里我们之前的ajax传入的值写错了，是直接就写了一个数字上去，其实data必须是一个字符串或者是一个映射。我们修改这里，ok。

另外就是重复触发事件，我们监听的scroll事件是大于等于0.95的滚动条时触发请求，这样在大于等于0.95到1的区间内重复请求，理论上请求之后滚动条长度会增加，也就内有重复触发，但是ajax是异步请求，我们的程序处理也需要时间，所以这里我有添加了一个标志，用来判断函数是否已经被调用。不过我想的太简单了，半天没有弄好。经过查资料说有个方式叫做函数去抖与函数节流，专门用来处理这种事件多次发生，优化函数执行。可以研究一下，链接放下面了。其实这里如果要优化还是可以进一步优化，比如判断鼠标的滚动方向等。其实我们这里做的还是不太好，等一下讲。

	var resizeTimer = null;
	function resizeListener(e){
	  if(resizeTimer) {
	    clearTimerout(resizeTimer);
	  }
	  resizeTimer = setTimeout(function(){
	    console.info('业务逻辑');
	  }, 100);
	}

所以我们对scroll事件的moremoments函数进行函数防抖。

之后现在有三个问题，一是我们的一条有多张图片的moments只显示了一张照片；二是有可能在还没有展开moremoments的时候图片超出了moments的长度，这样就会有滚动条，并且滚动鼠标的时候会触发moremoments的请求；三是缺少一个达到最后页的标志，否则就像现在这样，虽然加了函数防抖，但是用户可以一直（有间歇的，就是说可以一直调用moremoments函数）发送请求，当发送的请求超过最大值，整个页面就会卡在等待ajax返回的数据上。
先来修改第二个问题，这个比较简单。就是我们把带有滚动条的容器换成moremoments而不是momentscontainer。这样的话，相应的受到影响的js与css代码都要进行修改，但是比较简单稍微一修改就好，代码就不贴了。

然后是图片显示数量的问题，这个原因是我们没有对后端返回的moments对象中的pictures进行遍历，而是直接取得第一个(索引为[0])的picture的filename。我们只要在对对象进行解析的时候对picture进行遍历就可以了。

    var hasFilename = data.moments[i].picture[0];
    if (typeof(hasFilename) !== 'undefined') {
        var pictureDiv = document.createElement('div');
        pictureDiv.setAttribute('class', 'picture');
        var filename = null;
        for (var picIndex = 0; picIndex < data.moments[i].picture.length; picIndex++) {
            var pictureImg = document.createElement('img');
            filename = data.moments[i].picture[picIndex];
            pictureImg.setAttribute('src', '/pictures/' + filename);
            pictureDiv.appendChild(pictureImg);
        }
        momentsItem.appendChild(pictureDiv);
    }

最后解决第三个问题，我们在后端需要计算一共有多少页（offset）然后就行返回，也就是用户说，到达最大页数的时候进行判断，并提示用户到了最末页或者是禁止在发送请求。这个判断可以在前端做，也可以在后端做。

    moments.count().then(function (count) {
        var maxOffset = Math.ceil(count / itemNumber);
        var hasMore = 'y';
        if (maxOffset === offset) {
            hasMore = 'n';
        }
        moments.find().skip((offset - 1) * itemNumber).limit(itemNumber).sort('-sortTime').
        then(function (moments) {
            offset += 1;
            res.json({
                moments: moments,
                offset: offset,
                hasMore: hasMore
            });
            console.log(moments.length);
        });
    });

这样我们返回一个hasMore给前端，然后在前端把他作为一个属性赋给moremoments，当这个hasMore属性为'n'时，就不在允许发送请求。并且动态添加一个元素提示用户没有更多的内容了。

    $moreMoments.attr('has-more', data.hasMore);
	......
    if ($(this).attr('has-more') === 'y') {
        scrollPid = setTimeout(function () {
            console.info('业务逻辑');
            moreMoments();
        }, 100);
    }

运行一下，问题解决了。

然后现在我想给每个moments都添加时间，时间这个功能开始的时候（未展开）没有，因为我们要追求简洁。但是展开时候可以有，这个是很点单的，比我们之前的显示照片与moods还要简便，就不多说了。

    var timeDiv = document.createElement('div');
    var timeP = document.createElement('p');
    var timeText = document.createTextNode(data.moments[i].showTime);
    timeP.appendChild(timeText);
    timeDiv.appendChild(timeP);
    momentsItem.appendChild(timeDiv);

![](http://i.imgur.com/tu6SAn9.png)

然后我觉得滚动条（包括页面的滚动条）实在是太难看，占的地方太大。我想要换一种样式。ps在我从网上查找相关资料的时候，看到一个人的博客xuanfengge.com，他的logo的动画特别好，另外还有一些不错的特效等东西，我把链接放到下面，之后研究下。

最后我在moremoments的翻页到最后的时候发现了一点问题，就是我动态添加了一个表示没有更多内容的元素，然后没看到显示，但是dom中有，最后发现是div的高度有问题。一开始没注意，现在发现这个问题还有些复杂。我们的moments一开始的高度是50%，点击之后，高度变为99%。然而我们的moments-container与more-monents这两个高度我尽然脑残的设成了100%，moments-container还有兄弟元素占地方而且还没算margin与padding。。。所以这两个div应该重新设置高度，把moments-container的高度重新设置为90%。

然后这个也弄完了，最后对css进行一下修改，让视图美观一些。过程中我发现showTime的字符串中间有很多空格，很郁闷，检查发现也没有什么地方加了空格啊。后来想了想，是我的chrome上的一个插件，他会自动给半角与全角字符之间添加空格。。。

在修改的过程中发现了一个问题，就是我们先点击information、return、moremoments，这时候不进行请求，必须要再点击一下才进行请求。看了一会觉得代码没什么毛病，我今天没精神，头也昏昏沉沉，等头脑清醒了在看看这里。找到原因了，我们之前改了元素的判断是否有缓存，没有让moremoments进行显示，稍微修改一下就好了。




参考链接：

1. [http://www.cnblogs.com/fsjohnhuang/p/4147810.html](http://www.cnblogs.com/fsjohnhuang/p/4147810.html)
2. [http://www.cnblogs.com/dolphinX/p/3403821.html](http://www.cnblogs.com/dolphinX/p/3403821.html)
3. [http://www.alloyteam.com/2012/11/javascript-throttle/](http://www.alloyteam.com/2012/11/javascript-throttle/)
4. [https://segmentfault.com/a/1190000002701805](https://segmentfault.com/a/1190000002701805)
5. [https://www.zhihu.com/question/36888063](https://www.zhihu.com/question/36888063)
6. [http://blog.csdn.net/hanshileiai/article/details/40398177](http://blog.csdn.net/hanshileiai/article/details/40398177)
7. [https://segmentfault.com/q/1010000006961164](https://segmentfault.com/q/1010000006961164)