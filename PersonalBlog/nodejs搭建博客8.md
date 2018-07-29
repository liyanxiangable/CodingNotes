---
title: nodejs搭建博客8
date: 2017-04-24 08:53:16
tags:
---

我们的用户管理功能，首先要获得所有用户的信息。如下：

    mongoUsers.find(function (err, users) {
        console.log('注意，这不是演习！前方高能！');
        console.log(users);
    });
我们可以看到，用户信息以一个数组的形式返回回来，每个信息都是一个对象。
![](http://i.imgur.com/JrggIvQ.png)
我们现在要以表格的形式将数据在前端显示出来。那我们res.render传递数组我也不确定能不能传递，先来试一下：

    mongoUsers.find(function (err, users) {
        console.log('注意，这不是演习！前方高能！');
        console.log(users);
        res.render('admin', {
            showSignin: app.SendInfo.showSignin,
            showRegister: app.SendInfo.showRegister,
            showInformation: app.SendInfo.showInformation,
            username: 'xinyuanjieyi',
            isAdmin: true,
            users: users
        });
    });
可以看到是可以的，虽然官方文档上写的不是很详细没有说可以传递数组，看是这是确实可以的，如下：
![](http://i.imgur.com/GUapQ3v.png)
下面就可以放心的写前端页面了。我们对传递到jade模板的数组进行遍历，然后再分别取出每个字段的值。
![](http://i.imgur.com/fxAmQeJ.png)
嗯，下面问题又来了，如果有一天这个博客火了呢？到时候有很多的人来注册，我如果想要管理用户，就会有密密麻麻很多数据。所以我现在要对用户信息列表进行分页。
我们现在让用户管理一页显示4条数据。可以使用mongoose中的下面两个函数：
Query#limit(val)
Specifies the maximum number of documents the query will return.
Parameters: val <Number>，Example：query.limit(20)
Query#skip(val)
Specifies the number of documents to skip.
Parameters: val <Number>，Example：query.skip(100).limit(20)
这两个函数分别可以限制返回寻找的文档的队列的长度与跳过查询的文档的个数。现在假设我们要看第三页的用户信息，我们刚才说一页有4条数据信息。也就是说，我们查看的是（3-1）*４＋１～３＊４即第９到第１２条数据信息（暂时不考虑信息不够到达１２条的情况）。也就是说，我们要用这两个函数查看第ｎ页数据的话，他们各自的参数，应该是limit(4)与skip(4(n-1))。嗯，现在来使用改进的代码。报错了：
![](http://i.imgur.com/nxc57qA.png)
这是为什么呢？
![](http://i.imgur.com/y2VhU2d.png)
可以看到，我们的users并没有能够成功的得到用户信息数组，嗯，我们来看mongodb的find方法：
![](http://i.imgur.com/7lXGZcW.png)
所以我们可以看到，这个函数并没有像之前的那些函数一样，给他的回调函数标配地返回err与data，而是只返回了data：query，所以我们刚才写的参数err，users就会捕捉不到返回的数组，因为这个数组传给了err。嗯，大体就是这样，我们改掉这里，就好了：

    var itemNumber = 4;
    var pages = 2;

    mongoUsers.find().limit(itemNumber).skip(itemNumber * (pages - 1)).then(function (users) {
        console.log('注意，这不是演习！前方高能！');
        console.log(users);
        res.render('admin', {
            showSignin: app.SendInfo.showSignin,
            showRegister: app.SendInfo.showRegister,
            showInformation: app.SendInfo.showInformation,
            username: 'xinyuanjieyi',
            isAdmin: true,
            users: users
        });
    });
结果如图：
![](http://i.imgur.com/XAU9W50.png)
嗯，这样就说明成功了。
现在我们来做吧这一大堆数据分页，因为我们现在几乎是硬编码把页数给定死了。我们应当要显示页数，让用户选择。甚至是到了后期我们还可以让用户来选择每一页显示多少条数据。
好了，现在我们给页面一个分页，继续修改jade。
我们从bootstrap中得到的分页组件是这个样子的：

	nav(aria-label='...')
	  ul.pagination
	    li.disabled
	      a(href='#', aria-label='Previous')
	        span(aria-hidden='true') &laquo;
	    li
	      a(href='#') 1
	        span.sr-only (current)
	    li
	      a(href='#') 2
	        span.sr-only (current)
	    li.active
	      a(href='#') 3
	        span.sr-only (current)
	    li
	      a(href='#') 4
	        span.sr-only (current)
现在对他进行修改：

1. 我们不要固定几个li，而是可以显示5个（不一定），左右各2个。于是我们需要用迭代来写9个li。如果没有这么多的话那就显示全部。
2. 我们的active的li应当在中间，我们点击哪个li，就跳转到哪一页，并且相迎的li的class设置为active，之前的li的class取消active。
3. 我们默认显示第一页。

所以整个逻辑是下面这个样子的，对于客户端传来对第n页的请求。我们的分页有两个边界，分别是分页显示边界，即要显示n-2到n+2页；还有一个是实际数据的边界，即第0页到我们数据的尽头页数。我们的分页就限制在这两个边界之中，也就是说显示的页数应当取交集。我们开始迭代li。从0或者n-2这两个数中较大的数开始迭代页数，这是左边界。开始迭代呢，我们把内容赋值为#{n-2+count}并且赋给href相应的url，如果这个值小于等于0，那么我们就不显示他，其中这个count是每次迭代都自增的。然后迭代到n时也就是说到了用户指定的页数，我们给他一个class为active。另外在迭代过程中，我们还要检查是否达到了尽头页数或者n+2，这是右边界，如果达到了两者之一就要不显示或者停止迭代（停止迭代效率较高，但最多也就快4行代码）。这是分页中页数的思路，还有一个就是两端的箭头，我们要到达了边界时，对左边或者右边的箭头禁用。这样我们判断是否有n-3是否大于零或者n+3是否大于尽头页数，如果是的话，那么相应的箭头就要被设置为禁用。最后就是左右箭头的逻辑，点左箭头就是n-1，右箭头n+1。然后发起请求。
所以我们需要的参数有2个，分别是：

1. 用户点击的页数n（默认页为1）。在这里传jade模板中参数为currentPage
2. 尽头页数=（总用户数据个数）/每页显示数据个数，再进一取整。参数为lastPage
3. 最后就是一个计数变量count
下面是修改后的app.js部分代码：

	router.get('/', function (req, res, next) {
	    var itemNumber = 4;
	    var currentPage = 1;
	    mongoUsers.count()
	        .then(function (count) {
	            var lastPage = Math.ceil(count / itemNumber);
	            mongoUsers.find().limit(itemNumber).skip(itemNumber * (currentPage - 1)).then(function (users) {
	                console.log('注意，这不是演习！前方高能！');
	                console.log(users);
	                console.log(lastPage);
	                res.render('admin', {
	                    showSignin: app.SendInfo.showSignin,
	                    showRegister: app.SendInfo.showRegister,
	                    showInformation: app.SendInfo.showInformation,
	                    username: 'xinyuanjieyi',
	                    isAdmin: true,
	                    users: users,
	                    lastPage: lastPage,
	                    currentPage: currentPage
	                });
	            });
	        });
	});
我们如果直接用参数在元素上进行操作，代码较乱也不易实现。我们可以在jade开头的代码块中先进行一部分的简化运算。突然发现由于express自带的jade模板还是1.11旧版的，不资词有些新特性（比如说属性名这里的大坑），折腾了半天。现在卸掉jade，安装pug。下面是阶段性修改后的分页部分的pug：

	nav(aria-label='...')
	  - var halfShowPageNumber = 2;
	  - var isLeftAble = currentPage - halfShowPageNumber - 1 > 0 ? 'able': 'disabled';
	  - var isRightAble = currentPage + halfShowPageNumber + 1 < lastPage ? 'able': 'disabled';
	  - var startPage = currentPage - halfShowPageNumber > 0 ? (currentPage - halfShowPageNumber): 0;
	  - var endPage = currentPage + halfShowPageNumber < lastPage ? (currentPage + halfShowPageNumber): lastPage;
	  - var difference = endPage - startPage;
	  ul.pagination
	    li(class=isLeftAble)
	      a(href='#', aria-label='Previous')
	        span(aria-hidden='true') &laquo;
	    while (difference--)
	      li
	        a(href='#') #{startPage++}
	          span.sr-only (current)
	    li(class = isRightAble)
	      a(href='#', aria-label='Next')
	        span(aria-hidden='true') &raquo;
显示结果如下：
![](http://i.imgur.com/Pu8l2q5.png)
我们看到，输出的页码编号是0,1,2，对页码进行修改。并且我们还要加上当前页的效果以及href的设定。继续修改：

	nav(aria-label='...')
	  - var halfShowPageNumber = 2;
	  - var isLeftAble = currentPage - halfShowPageNumber - 1 > 0 ? 'able': 'disabled';
	  - var isRightAble = currentPage + halfShowPageNumber + 1 < lastPage ? 'able': 'disabled';
	  - var startPage = (currentPage - halfShowPageNumber) > 1 ? (currentPage - halfShowPageNumber): 1;
	  - var endPage = (currentPage + halfShowPageNumber) < lastPage ? (currentPage + halfShowPageNumber): lastPage;
	  - var difference = endPage - startPage + 1;
	  - var currentOffset = currentPage - startPage;
	    p halfShowPageNumber = #{halfShowPageNumber}___
	      | currentPage = #{currentPage}___
	      | lastPage = #{lastPage}___
	      | startPage = #{startPage}___
	      | endPage = #{endPage}___
	      | difference = #{difference}___
	      | currentOffset = #{currentOffset}
	  ul.pagination
	    li(class=isLeftAble)
	      a(href='#', aria-label='Previous')
	        span(aria-hidden='true') &laquo;
	    while (difference--)
	      if (currentOffset-- === 0)
	        li(class='active')
	          a(href='/admin?page=' + startPage) #{startPage++}
	            span.sr-only (current)
	      else
	        li
	          a(href='/admin?page=' + startPage) #{startPage++}
	            span.sr-only (current)
	    li(class = isRightAble)
	      a(href='#', aria-label='Next')
	        span(aria-hidden='true') &raquo;
然后是admin.js的修改，为了方便调试，我们先默认是管理员：

	var express = require('express');
	var app = require('../app');
	var mongoUsers = require('../schema/schema');
	var bluebird = require('bluebird');
	var router = express.Router();
	
	router.get('/', function (req, res, next) {
	
	    var itemNumber = 4;
	    var currentPage = 1;
	    if (req.query.page) {
	        console.log(req.query.page);
	        currentPage = req.query.page;
	    }
	    mongoUsers.count()
	        .then(function (count) {
	            var lastPage = Math.ceil(count / itemNumber);
	            mongoUsers.find().limit(itemNumber).skip(itemNumber * (currentPage - 1)).then(function (users) {
	                console.log('注意，这不是演习！前方高能！');
	                console.log(users);
	                console.log('lastPage = ' + lastPage, 'currentPage' + currentPage);
	                res.render('admin', {
	                    showSignin: app.SendInfo.showSignin,
	                    showRegister: app.SendInfo.showRegister,
	                    showInformation: app.SendInfo.showInformation,
	                    username: 'xinyuanjieyi',
	                    isAdmin: true,
	                    users: users,
	                    lastPage: lastPage,
	                    currentPage: currentPage
	                });
	            });
	        });
	});

	module.exports = router;
这里我检查了几遍，不知道为什么当currentPage不等于1时endPage总是等于6。这里存疑，等有机会再请教一下吧。先继续往下做。
最后总结一下问题：
1. endPage这里总是等于6
2. 没有用Ajax
3. 没有用模板的继承
4. 硬编码了管理员身份
这些问题先保留等最后的优化，我们继续往下做。

这一篇怎么回事，很多代码为什么都不显示格式？

参考链接：
[http://www.expressjs.com.cn/4x/api.html#res.render](http://www.expressjs.com.cn/4x/api.html#res.render)
[https://docs.mongodb.com/manual/indexes/](https://docs.mongodb.com/manual/indexes/)
[https://cnodejs.org/topic/50581fee6e63205c7001880d](https://cnodejs.org/topic/50581fee6e63205c7001880d)
[http://www.w3school.com.cn/tags/tag_tr.asp](http://www.w3school.com.cn/tags/tag_tr.asp)
[https://pugjs.org/zh-cn/language/iteration.html](https://pugjs.org/zh-cn/language/iteration.html)
[http://v3.bootcss.com/components/](http://v3.bootcss.com/components/)
[http://v2.bootcss.com/base-css.html#tables](http://v2.bootcss.com/base-css.html#tables)
[http://www.nodeclass.com/api/mongoose.html](http://www.nodeclass.com/api/mongoose.html)