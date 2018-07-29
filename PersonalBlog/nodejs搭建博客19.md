---
title: nodejs搭建博客19
date: 2017-05-02 15:23:00
tags:
---


在写代码的时候一定要注意，默认事件，a元素等等。要不然很多时候就是检查不出哪里出错来。。。刚才我就是这样，a元素里没写地址，然后用的是监听点击事件来使页面发送ajax请求给后端。但是这样不会有效果的，因为首先执行a元素的点击，地址为空，就刷新了，也就没有执行ajax。

    $moreBlogs.on('click', function (event) {
        var pages = Number($(this).attr('data-pages').substring(5));
        alert(pages);
        $.ajax({
            type: 'POST',
            url: '/moreblog',
            data: {
                pages: pages
            }
        });
    });
然后我的后端暂时这样写的（我想用query复用之前的路由，而不是单独再另写一个路由）：

	router.post('/moreblog', function (req, res, next) {
	    if (req.body.pages) {
	        var pages = req.body.pages;
	    }
	    var articleNumber = 8;
	    console.log('我收到了: ' + req.body.pages);
	    blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
	        .then(function (blogs) {
	            pages += 1;
	            console.log('当前的pages是：' + pages);
	            res.render('index', {
	                blogs: blogs,
	                pages: pages,
	                showSignin: app.SendInfo.showSignin,
	                showRegister: app.SendInfo.showRegister,
	                showInformation: app.SendInfo.showInformation,
	                username: app.SendInfo.username,
	                isAdmin: app.SendInfo.isAdmin
	            });
	        });
	});
结果显示：

![](http://i.imgur.com/xsPbui5.png)

21？？？黑人问号？？？看来是一个原先pages是字符串，然后又加了1。修改掉这个之后，发现点击了之后没有反应。我从控制台输出获取的blogs，也能获取到，但是为什么不渲染呢？

要疯了，可以看到，在network中找到我们的请求moreblog，发现preview中已经有了渲染的html，可是他就是不显示。终于，在折腾了半天，我发现是ajax的问题。ajax确实好使，但是他不刷新这一点虽然是提升用户体验的，可是对于我们这种情况，要重新渲染页面就无能为力了。所以改用原生js方法进行post请求。。。好了。

那还有一个问题（怎么这么多问题？），就是文章翻到最后我们要给用户一个提示，并且能让用户返回。或者说有能让用户上翻的按钮，这样感觉更好一些。
我们可以在#content的开始，博客列表的上边添加一个相对于more-blogs的按钮。这样由于这个按钮做的是与more-blogs的功能相对应的功能，我们可以考虑把他们抽象在一个函数中。为了告诉后端到底是哪里发送的请求，请求之后的博客还是以前的博客，可以在post的发送数据中，添加一个标识。

另外prev-blogs一开始是隐藏的，我们可以在pug模板中对他的显示与隐藏加以控制。这样我们把文章列表一共能有多少页也传进pug模板，来控制对more-blogs的显示与隐藏。代码一遍通过(･∀･)！

刚才遇到了路由的问题，由于之前把前端的页面都改了，现在想获取等多博客文章的时候，发出请求，但是之前我们路由规定'/'使用indexSever模块，我也想把相应的功能放在indexSever模块里边，于是请求就找不到服务器的响应的处理，所以出现了问题。其实就是不是先匹配在app.js中定义的路由，而是先匹配第一个在app.js中的路由，如果没有则匹配下一个，如果匹配有条件暂时相符的话再进入模块进行匹配。模块中没有的话就再对下一个app.js中的路由进行匹配。这么说很罗嗦，举个栗子：

url为/hello/hi，app.js中有：

	app.use('/', index);
	app.use('/hello', hello);
这时候如果index路由中有/hello/hi的话就不会再寻找hello路由中的hi了。










参考链接：

1. [http://expressjs.com/en/api.html#router](http://expressjs.com/en/api.html#router)
2. [https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient)

