

---
title: nodejs搭建博客18
date: 2017-05-01 13:56:07
tags:
---

现在来对index进入引导页的内容进行修改。
先对文字进行了修改，由纯黑色变为较为柔和一些的#444与#6a6a6a等颜色。对文字的间距做出适当修改。把背景颜色调的较为柔和一些，颜色靠近各区域颜色，由#ccc改为#ddd。

现在右半部份，我想把每一篇博客独占一格，而不是一起在一个大区域上，这样不好区分。所以把right-container的背景颜色删掉。并且right-container与right-section就不用加以区分了，把这两个和合成新的right-section。给blog-item添加样式，为了使文章的开头更加明显，可以在每个文章的区域的开头增加一点装饰以区分。然后日期的格式不好看，把他在后端进行存储的时候就进行修改。

	var time = new Date();
	var str = time.toLocaleString();
	dateArr = str.split(' ');
	ymd = dateArr[0].split('-');
	hms = dateArr[1].split(':');
	var date = ymd[0] + '年' + ymd[1] + '月' + ymd[2] + '日' + ' ' + hms[0] + ':' + h[1];
现在弄好了这里，但是有一个不是问题的问题，就是我们一般情况下的上传日志没有说一分钟上传多篇的。我在上传问博客的功能上也是设置只能单文件上传。但是文件的显示排列是按时间顺序的，也就是一分钟内的文件上传他看做时间是相同的。我们之前是精确到秒的，现在修改后可能有排列的不是我们上传的时候的顺序问题。但是这个一般不要紧。

改完了之后，发现点击没效果。嗯，吧js中选择器的选择的名称也要修改。一秒钟改好之后，改下一个地方。文章点击之后再次点击还进行加载。这个时候我们应该屏蔽掉多余的点击次数。

这个时候遇到了很诡异的事情。(♯｀∧´)我点击博客9就可以加载，其他的博客就会卡住，network状态一直显示pending。我在后端加了一个测试是否接收到请求的信息log。显示已经收到。然后又加了一个发送信息的log，结果没有信息。

	router.post('/show', function (req, res, next) {
	    console.log('我已经接收到请求了');
	    var title = req.body.title;
	    blogs.findOne({
	        title: title
	    }, function (err, blog) {
	        var HTMLContent = markdown.toHTML(blog.content);
	        res.json({
	            text: HTMLContent
	        });
	        console.log("我发送数据了");
	    });
	});
我的后端怎么就出问题了呢？打印req.body结果log显示500错误了。。。而且现在那篇可以打开的文章也报错了。这很奇怪啊，第九篇第四篇可以展开，但是打印req.body报错，其他的有几篇一直打不开。。。
更正一下问题，经过一下午的测试，是除了第八篇的所有的文章都能展开，直到点击到第八篇，之后的请求就被阻塞了。数据库中删掉第八篇博客，其他的博客没有影响全都能打开。然后我又在后端进行监测，发现编译成html没有输出。难道是那篇文章中有什么特殊的内容？不过我看了一下，这一篇在预览的时候的确有很多pug代码没有被高亮成代码格式。

我不知道那个nodejs搭建博客8这一篇有什么问题。为什么就是只有他没法展开。这个问题之后慢慢解决。我们的是0.5.0的markdown来解析的，看看是不是js插件的原因。

这个先不管了，继续做之前的内容，我想的是给每一个文章加一个文章是否被打开的标志。然后展开之后对标志进行切换，标志作为执行ajax请求的条件。思路是很清晰，但是我又成功的卡壳了一晚上。。。就在于获取当前点击的对象。$(this)正常来说是可以的，但是我把他写到ajax请求里边的时候，它就变成了函数对象，如图：
![](http://i.imgur.com/36lhR9A.png)
上图中四个对象分别是console.log($(this));var now = $(this);console.log(now);与在ajax函数中                    console.log($(this));console.log(now);的结果。

当然可以放在ajax外边，但是，ajax请求失败的时候，文章并没有展开，这时候放到外边执行了改变标记的代码，文章之后就不可能再被展开了。所以我新建了一个变量指向了$(this)当前指向的元素的jquery对象。然后利用这个新建的对象对属性进行修改。这样就好了。

我想像知乎那种样的有文章的展开的效果，有省略号，提示点击查看全文这样的。但是我们的文章预览是已经规定好的200字，一般情况下不会多也不会少（除非链接图像什么的）。所以不太适合用于那种显示高度的，所以我就在p段落后边手动加上省略号。这样看起来号简陋。手动加上省略号要在文章展开的时候对省略号进行隐藏。注意隐藏的是当前文章的省略号而非全部文章。然后就是使用bootstrap标签。这里标签的显示与隐藏逻辑与省略号是一样的。我本来想不用bootstrap的，但是现在看还是有些地方要用到它。用是可以用，不过我总觉得这样很丑。

下面的问题是，对文章进行收起。文章太长，不想看了就要进行收起。我在文章的末尾添加一个图标。点击的时候有两种方式，一是使用ajax请求，二是不发送请求，直接从前端完成。当然是前端好，先添加收起按钮。然后该怎么做呢？获取当前的按钮所在文章p元素中的全部文本。对其进行截断前200个字符。如下：

    $('#content').find('.close-content').on('click', function () {
        var e = $(this).prevAll('.main-body').text().substring(0, 200);
        $(this).prevAll('.main-body').first().html(e);
    });
然后对close按钮以及more按钮进行切换。并且把博客内容展开的标志进行切换。这个时候就遇到了一个问题，我对close按钮点击，操作的时候发现博客收起了之后迅速又迅速展开了。这是因为我们的操作是监听的点击事件，而点击事件会冒泡，一层一层的向上传递。在close按钮这里是一个点击事件，执行了相应的函数，包括对博客展开标志的切换，但是时间冒泡到父元素的时候，上一个事件监听也会执行相应的操作-点击博客列表就会展开。所以这里要对对事件冒泡进行阻止。也有其他的办法，比如说把展开博客的监听改为more按钮，就当是个思路吧，这个我没有尝试。
有个需要改进的地方就是博客展开又收起之后，文章的位置偏下。不太好描述，就是说，当点开了一个文章，文章很长，滑倒最后想要收起的时候，滚动条在很靠下的位置，但是收起了之后滚动条没有变。这样体验不好，应当给博客文章与close按钮加上锚记与锚元素。但是难点在于之前向服务器发送博客文章请求时也提到过的博客列表条目的id是后端（要）动态添加的，而在前端使用这些属性的时候并不容易在html标记上获取及使用。所以在之前的一些操作中也是各种this。我想这里可以利用循环时候的index给每个blog列表条目固定的id，表示他的绝对位置。ok了。我不明白为什么图标字体又不能用了，反正也不好看，还折腾了好长时间，真想干脆图标全删了算了。

	.blog-item(data-title= blog.title, data-index= index, expanded='able', id='blog-item' + index)
	......
      .close-content
        a(href='#blog-item' + index)
          span.glyphicon.glyphicon-chevron-left
          | CLOSE
最后还有一个大的问题要解决，就是文章列表滑动到最后，需要一个页码或者是翻页的东西，然后对相应的博客文章对服务器做出请求，最终服务器返回文章列表渲染。。。。我想在最下面有两个选项，一个查看全部文章，另一个显示往后8篇文章。先来做显示之后的八篇文章的。

所以首先在文章列表的最后要有一个按钮。点击按钮发送请求。我们看后端blogSever或者是index（由于更改了前端页面，但是还没有完成，所以这两个的blog部分的代码截止到目前是相似的）的代码：是第一个路由函数即post到/blog的函数对列表进行返回，现在是硬编码了pages=1。我们现在应该对当前的pages进行获取发送。但是这还是要追朔到对文章列表的第一次请求。默认的pages应该是1没错，但是现在如果想看之后的八篇文章，就应该有个计数功能或者参数。我们之前在blog页面做过一个算是插件的分页导航，这里我不准备用它，我想把它放到全部文章的功能里面。所以现在我们得重新实现计数。所以在渲染页面的时候要把pages的值也发送到前端。把pages的值给最后的翻页按钮，再进行处理。

这里遇到了路由问题，下篇说。







参考链接：

1. [http://www.w3school.com.cn/jquery/attributes_attr.asp](http://www.w3school.com.cn/jquery/attributes_attr.asp)
2. [http://www.w3school.com.cn/jsref/met_element_setattribute.asp](http://www.w3school.com.cn/jsref/met_element_setattribute.asp)
3. [http://www.cnblogs.com/Tally/archive/2013/01/04/2844042.html](http://www.cnblogs.com/Tally/archive/2013/01/04/2844042.html)
4. [https://segmentfault.com/q/1010000006682394](https://segmentfault.com/q/1010000006682394)
5. [http://www.runoob.com/css3/css3-gradients.html](http://www.runoob.com/css3/css3-gradients.html)
6. [http://www.w3school.com.cn/jquery/jquery_traversing_ancestors.asp](http://www.w3school.com.cn/jquery/jquery_traversing_ancestors.asp)
7. [http://www.w3school.com.cn/jquery/jquery_dom_get.asp](http://www.w3school.com.cn/jquery/jquery_dom_get.asp)
8. [http://www.w3school.com.cn/jsref/jsref_replace.asp](http://www.w3school.com.cn/jsref/jsref_replace.asp)
9. [https://zhidao.baidu.com/question/570704325.html](https://zhidao.baidu.com/question/570704325.html)
10. [http://www.cnblogs.com/chyingp/p/6072338.html](http://www.cnblogs.com/chyingp/p/6072338.html)
