---
title: nodejs搭建博客26
date: 2017-05-06 21:52:40
tags:
---


发现了之前的一个小问题，我们在某一页的博客列表中点击展开博客，然后翻到另外的一页博客列表。这时候在另一页相对应的博客列表的条目下边显示的不是expand而是close。所以我们要做一个翻页进行复位的功能。
    var $moreContent = $('.more-content');
    var $closeContent = $('.close-content');
    $moreContent.show();
    $closeContent.hide();
另外对图片添加功能，当点击图片的时候，进入看图模式。看图模式中，不能进行其他的页面操作，图片都是连续的，不是分成一个个的moment，可以对图片进行放大，旋转等（微信、微博分享？）操作。所以要在每张图篇加载结束，并点击图片（进入看图模式）的时候，把图片放进图片队列。怎么进入看图模式？我是想利用一个display:none并且position:fixed的并且能够占满整个窗口的元素，打开看图模式的时候把他显示出来。推出的时候隐藏此div。或者我一开始就没有这个元素，进入看图模式的时候创建并插入这么一个元素。另外也可以使用jquery的slideDone方法什么的。这里我使用jquery来实现。还有这里牵扯到一个动态添加的元素绑定事件的问题。因为我们普通的绑定事件就是用选择器，但是如果是动态添加元素，我们的选择器选择不到新创建的元素。所以应当绑定动态添加元素的祖先某个元素，然后再对子元素进行选择并绑定事件。
    $moreMoments.on('click', '.moments-images', function () {
        var src = $(this).attr('src');
        $pictureMode.find('img').attr('src', src);
        $pictureMode.css('display', 'block');
    });
由于我们的放大缩小与顺时针逆时针旋转具有继承之前的操作的性质，所以我们在这些图片上添加相应的属性。
与图爿模式的div不同，showImage我想用js动态创建，用户每次想查看一个新的图片就创建一个新的showImage（或是把图片们添加到一个数组中，以重复看图时节省资源）。因为这样便于对图片进行操作。
所以修改刚才的代码，showImage由动态创建并且添加相应属性。这里的函数可以进行抽象，但是最近太多事了，身体也累，心也累，不想弄了。我在这里一开始定义一个。。。算了，太累不说了，总之是错的。应该怎么做这种要对css进行的操作？就是直接定义这个元素的属性，直接在css(元素属性style)上修改。另外还用到了从字符串中取出数字，利用了正则表达式。如下：
    $moreMoments.on('click', '.moments-images', function () {
        var src = $(this).attr('src');
        $pictureMode.css('display', 'block');
        $imageBox.append('<img id="showImage" />');
        var $showImage = $imageBox.find('img');
        $showImage.attr({
            'src': src,
            'style': 'transform: rotate(0deg)'
        });
    });
    $clockwise.on('click', function (event) {
        var $Image = $('#showImage');
        console.log(typeof $Image.attr('style'));
        var degree = Number($Image.attr('style').replace(/[^0-9]/ig, "")) + 90;
        console.log(degree);
        alert(degree);
        $Image.css({
            'transform': 'rotate(' + degree + 'deg)',
            '-ms-transform': 'rotate(' + degree + 'deg)',
            '-moz-transform': 'rotate(' + degree + 'deg)',
            '-webkit-transform': 'rotate(' + degree + 'deg)',
            '-o-transform': 'rotate(' + degree + 'deg)'
        });
        event.stopPropagation();
    });
逆时针同理。算了，我还是忍不住把两个方向旋转的函数合成了一个。
但是这里还是有问题。虽然说一般没人一直宣传图片玩，但是rotate的度数是有限制的。据我观察这里的度数不能超过负180度。但是正的度数暂时没看到有限制。这里为了不出bug，我想对度数调节做一下改进。把-90度的情况直接修改为正270度，这样就好了。

然后要做的其实是应该一开始做的，就是进入图片模式的时候把图片放进缓存数组，退出的时候清空或释放缓存，这对于资源的节约十分有利。点击某一个图片的时候，他就是这个数组的第一个元素，然后对图片进行上翻或者下翻的时候，有新的图片需要展示，这个时候把新的图片再放进缓存数组。等到此次图片模式中再一次展示这个图片的时候，利用缓存而不是重新请求。（这里插个细节，更换显示的图片需要将之前的图片在DOM中删除）。对于用户可能上下不规则地使图片进行展示，我们也可以不用数组而是使用集合（js中有没有集合？我好像没听说过，真没注意）。发现缓存这里水很深，我了解到的方法是将图片转为base64，然后再做。不过浏览器现在都有优化，自动缓存，不用我们手动去做。也就是说我想多了。。。。那算了，接着往下做吧。
图片的放大与缩小。我觉得可以在图片上设置两个属性width与height，然后监听鼠标的滚轮事件，成比例地修改这两个属性。但是图片不会过大，因为我们限制了父元素的大小。但是这里我总觉得有坑，因为我css不太扎实，对于这种布局啊居中啊大小限制啊什么的，掌握不好。
我这里尝试了很长时间的用鼠标滚轮操作图片改变大小，结果就是与之前的阻止默认事件冲突。所以还是用点击按钮吧(๑-﹏-๑)。

最后就是图片翻页。这个比较煎蛋，就是定位当前的图片元素，然后寻找上一张与下一张的图片（找相邻moment，如果相邻的moment没有图片只有moods，就再往下找），找到之后解析他的src地址，然后赋给要展示的图片。我想新增一个属性，用以记录想要展示的图片相对于一开始点击的图片的位置。我定义了一个数组，在之前的点击显示moremoments与鼠标滚动显示moremoments的时候（也就可以在ajax请求的回调函数中），把图片的src放在这个数组中。在看图模式的时候就可以使用这个数组。这个数组是绝对的坐标，我们可以给每个图片都设置一个编号属性。然后用户点击哪一个图片，就读取哪一个图片的编号，通过用户上翻下翻图片，记录一个偏移，然后通过偏移位置与绝对位置的编号来获得相对应位置的src。
    ......
	for (var picIndex = 0; picIndex < data.moments[i].picture.length; picIndex++) {
		......
        pictureImg.setAttribute('index', pictureIndex);
        pictureSrcArray.push({pictureIndex: src});
        pictureIndex++;
    }
	......	
    $anotherPicture.on('click', function (event) {
        var $showImage = $imageBox.find('img');
        var offset = Number($showImage.attr('offset'));
        var index = Number($showImage.attr('picture-index'));
        if ($(this).attr('id') === 'last-picture') {
            offset--;
        } else if ($(this).attr('id') === 'next-picture') {
            offset++;
        }
        var showPictureIndex = index + offset;
        var src = pictureSrcArray[showPictureIndex].pictureIndex;
        console.log(src);
        $showImage.attr({
            'src': src,
            'offset': offset
        });
        event.stopPropagation();
    });

最后加上对第一张与最后一张图片的判断，并对用户的操作进行提示。

另外我还想做个扩展题，就是有个影集模式，进入这个模式，图片全屏，自动播放，放点音乐，很高大上！

还想用socket来实现一个wifi传输文件的功能，分享的功能。

我想把moments那一栏的图片的功能进行增强。就是用户可以点击图片，这样进入图片阅览模式，图片会放大。
还有一个想法是有个可以点击侧滑出来的板块，我们的页面就这一张，所以不得不挤压空间。

25篇之前的东西就算是把博客大体上做完了。下面想做一些附加题。从现在开始博客搭建的过程就开始慢下来了，因为还有别的好多的事要做。但是我会一直维护，还有很多的功能没有做。

另外我们还有用户的功能没有做完，虽然有用户注册与登录，但是没有实质性的内容。
admin页面还没有美化，而且上传文件等操作还应该增加上去对表单输入的判断。




参考链接：

1. [http://blog.csdn.net/u012800044/article/details/41555361](http://blog.csdn.net/u012800044/article/details/41555361)
2. [http://blog.csdn.net/h_qingyi/article/details/53424069](http://blog.csdn.net/h_qingyi/article/details/53424069)
3. [http://blog.sina.com.cn/s/blog_51048da701018490.html](http://blog.sina.com.cn/s/blog_51048da701018490.html)
4. [http://blog.csdn.net/freshlover/article/details/11579669](http://blog.csdn.net/freshlover/article/details/11579669)
5. [https://segmentfault.com/q/1010000007430617?_ea=1342958](https://segmentfault.com/q/1010000007430617?_ea=1342958)
6. [http://www.cnblogs.com/coco1s/p/4375774.html](http://www.cnblogs.com/coco1s/p/4375774.html)
7. [http://blog.csdn.net/chelen_jak/article/details/28886311](http://blog.csdn.net/chelen_jak/article/details/28886311)
8. [https://segmentfault.com/q/1010000006692517/a-1020000006692824](https://segmentfault.com/q/1010000006692517/a-1020000006692824)
9. [http://itindex.net/detail/44065-js-event-%E5%AF%B9%E8%B1%A1](http://itindex.net/detail/44065-js-event-%E5%AF%B9%E8%B1%A1)



