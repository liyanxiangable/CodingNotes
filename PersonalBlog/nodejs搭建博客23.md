---
title: nodejs搭建博客23
date: 2017-05-04 14:15:08
tags:
---


现在把picture展示成图片，目前已经获得filename，需要在ajax中回调函数中再一次进行ajax请求，先创建img元素，请求发送的数据为filename。哦不用，我们直接写img的路径就可以了，就像之前在index.pug首次渲染的时候。将文件路径（filename）用setAttribute方法赋给图片的src。

    if (typeof(filename) !== 'undefined') {
        var pictureDiv = document.createElement('div');
        var pictureImg = document.createElement('img');
        pictureImg.setAttribute('src', '/pictures/' + filename);
        pictureDiv.appendChild(pictureImg);
        momentsItem.appendChild(pictureDiv);
    }
刷新下可以看到已经成功了：

![](http://i.imgur.com/vrzPUew.png)

另外我们需要给上述几个动态创建的元素添加属性，以适应之前的css样式。这个很简单，就不写了，不过想吐槽一下，用原生js的话，setAttribute函数接收的是字符串参数，也就是说如果要动态设置的属性有很多的话，那么用这个方法就要写一大堆。。。

回到后端，最后来处理关于moments的offset。现在我是硬编码了offset=1，其实这个也应该像之前moreblog那样设定一个计数。代码如下：

	router.post('/moremoments', function (req, res, next) {
	    var offset = 0;
	    if (req.body.offset) {
	        offset = Number(req.body.offset);
	    }
	    offset += 1;
	    var itemNumber = 15;
	    moments.find().skip((offset - 1) * itemNumber).limit(itemNumber).sort('-sortTime').
	        then(function (moments) {
	        res.json({
	            moments: moments,
	            offset: offset
	        });
	    });
	});

现在又遇到了新的问题，有两个，一是图片不能按照正常大小显示，另一个是鼠标滑轮不能滚动。对于第一个问题，之前在css中有规定，在前端脚本动态创建元素的时候需要同时加上相应的类或者id。这个比较好解决。另外这里我有之前写的有个display: table-cell，结果这个元素怎么设置居中都不管用，折腾半天试着把他去掉，结果可以了。

现在来看第二个屏幕不能滚动的问题。我们需要对左侧容器内部添加滚动条，添加div内部的滚动条有2个条件。分别是overflow:auto(scroll)，div设置宽高。

做完了之后我们点击返回的时候，希望他回到原来的样子而不是仅仅是对div高度的改变。所以我想之前的吧容器内部清空的做法不太好。比较好的做法是保留他，然后在两个状态之间进行切换。这样的话我们给最开始显示的moments添加id，让他在moremoment点击时隐藏，return时显示，去掉清空html的代码。然后新建一个开始时不占地方的div容器，让他来盛放动态生成的moments-item。然后这样就已经实现了，但是我们可以再进行优化。就是我们点击return回到开始的状态，再点击more-moments，这个时候我们之前已经有了数据，就不要在进行请求了。我们可以给是否有缓存设置一个标志，点击more-moments的时候就做判断，如果有缓存，就显示缓存的，如果没有，那再进行新的请求。这个很简单，不贴代码了，过段时间贴总的。

然后还有个地方就是，more-blog这里，点击之后左侧的内容显示错误，这是因为页面刷新，但是并没有发送左侧要渲染的数据。所以这就很麻烦，讲道理不刷新好，但是不刷新没法重新渲染页面，因为blog的内容比moments复杂，他有复杂的格式是在前端没法解析成html的；但是刷新就会使得左侧的内容受到影响。那现在应该怎么做，pug模板是可以继承的，如果我让左侧与右侧这两个大的板块继承于一个index的pug模板，这样在需要刷新左侧的时候render左侧模板，需要刷新右侧的时候render右侧模板，可以吗？pug我还不太熟悉。先保留这个思路，等弄完了别的地方pug也更懂了的时候再弄这里。这也算是异步吧。
然后接着之前的就是moments的翻页，我想实现鼠标滚轮滚到最下面接着滚N圈，然后继续加载新的moments。jquery中有一个scroll方法，他可以触发scroll事件，发生scroll事件时也会运行此函数。嗯，事件与函数伴随着，利用这个函数，我们来对鼠标滚轮的滚动的位置进行监控，如果鼠标滚动到最下面时，我们就触发请求。我写好了代码，但是不知道为什么，触发不了事件，找了半天原因，原来是div的问题。我们左侧嵌套了多个div。但是滚动条到底是在哪个div上要分清，应该是css中设定了overflow:auto的那一个div。

    $momentsContainer.scroll(function () {
        var viewHeight = $(this).height();
        var contentHeight = $(this).get(0).scrollHeight;
        var scrollTop = $(this).scrollTop();
        if (scrollTop / (contentHeight - viewHeight) >= 0.95) {
            moreMoments();
        }
    });

然后我们触发ajax请求的时候，却没有发送请求，为什么呢？我们之前设置了一个是否有缓存的标志，现在展开之后标志已经是表示存在缓存了，而且在抽象函数的过程中，我们把标志的判断都放到了moremoments函数中，这样不管是谁调用了这个函数都会判断缓存标志。现在可以将标志的判断这个过程发在点击moments要调用moremoments这里，这样就OK了，重新打开moremoments的时候进行检查，而在展开的时候发送请求不用检查。

    $moments.on('click', function () {
        $information.hide();
        $firstMoment.hide();
        $return.show();
        $(this).css('height', '99%');
        var flag = $moreMoments.attr('has-cache');
        if (flag === 'n') {
            moreMoments();
        } else if (flag === 'y') {
            $moreMoments.show();
        }
    });

然后是抽象出的moremoments的函数：

    function moreMoments() {

        $.ajax({
            type: 'POST',
            url: '/moremoments',
            data: 1,
            success: function (data) {
                console.log(data);
                console.log(data.moments);
                console.log(data.moments.length);
                var moreMoments = $moreMoments.get(0);
                for (var i = 0; i < data.moments.length; i++) {
                    console.log('running No. ' + i);
                    var moods = data.moments[i].moods;
                    var filename = data.moments[i].picture[0];
                    console.log('状态' + moods + filename);
                    var momentsItem = document.createElement('div');
                    momentsItem.setAttribute('class', 'moments-item');
                    if (typeof(filename) !== 'undefined') {
                        var pictureDiv = document.createElement('div');
                        var pictureImg = document.createElement('img');
                        pictureImg.setAttribute('src', '/pictures/' + filename);
                        pictureDiv.setAttribute('class', 'picture');
                        pictureDiv.appendChild(pictureImg);
                        momentsItem.appendChild(pictureDiv);
                    }
                    if (typeof(moods) !== 'undefined') {
                        var moodsDiv = document.createElement('div');
                        var moodsP = document.createElement('p');
                        var moodsText = document.createTextNode(moods);
                        moodsDiv.setAttribute('class', 'moods')
                        moodsP.appendChild(moodsText);
                        moodsDiv.appendChild(moodsP);
                        momentsItem.appendChild(moodsDiv);
                    }
                    moreMoments.appendChild(momentsItem);
                }
                $moreMoments.attr('has-cache', 'y');
            }
        });
    }

![](http://i.imgur.com/PnZ9trN.png)

总之，现在成功了，可以看到非常的一颗赛艇。




参考链接：

1. [http://www.w3school.com.cn/jsref/met_element_setattribute.asp](http://www.w3school.com.cn/jsref/met_element_setattribute.asp)
2. [http://www.w3school.com.cn/cssref/pr_text_text-align.asp](http://www.w3school.com.cn/cssref/pr_text_text-align.asp)
3. [http://www.w3cplus.com/css%2520/img-vertically-center-content-with-css](http://www.w3cplus.com/css%2520/img-vertically-center-content-with-css)
4. [http://www.zhangxinxu.com/wordpress/2009/08/%E5%A4%A7%E5%B0%8F%E4%B8%8D%E5%9B%BA%E5%AE%9A%E7%9A%84%E5%9B%BE%E7%89%87%E3%80%81%E5%A4%9A%E8%A1%8C%E6%96%87%E5%AD%97%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD/](http://www.zhangxinxu.com/wordpress/2009/08/%E5%A4%A7%E5%B0%8F%E4%B8%8D%E5%9B%BA%E5%AE%9A%E7%9A%84%E5%9B%BE%E7%89%87%E3%80%81%E5%A4%9A%E8%A1%8C%E6%96%87%E5%AD%97%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD/)
5. [http://blog.csdn.net/quincylk/article/details/25875301/](http://blog.csdn.net/quincylk/article/details/25875301/)
6. [http://blog.csdn.net/lwjnumber/article/details/6319598](http://blog.csdn.net/lwjnumber/article/details/6319598)
7. [http://bbs.csdn.net/topics/390775995/](http://bbs.csdn.net/topics/390775995/)
8. [http://blog.csdn.net/greenqingqingws/article/details/38018225](http://blog.csdn.net/greenqingqingws/article/details/38018225)
9. [http://www.w3school.com.cn/jquery/event_scroll.asp](http://www.w3school.com.cn/jquery/event_scroll.asp)