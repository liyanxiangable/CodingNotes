---
title: nodejs搭建博客12
date: 2017-04-27 21:21:17
tags:
---


经过了之前的努力，终于把博客文章能够加载出来了。但是又有了新的问题，其中首先就是我们想显示在页面上的是一个文章的列表，之前我们制作的是一个文章。并且硬编码了文章标题作为文章在数据库中被查找的键。但是我们现在一是不能只有一篇文章，二是文章不能再硬编码来查找。我们先来解决他们。
对于多个文章，从上向下这样排列的话，我们将文章的数量显示为10个。然后鼠标滚到最下端点击也好，其他的方式也好，再显示出之后的文章。这个功能我们先略过。我们在点击到博客的列表页面时，通过数据库，将8篇文章的标题等信息发送到前端进行渲染，或是在后端编译到pug进行渲染。这样可行，但是选哪8篇文章呢？我想按照文章的发表时间进行展示。所以说，我们的文章上传的时候，我们除了之前的几个字段要保存之外，还应该保存一个文章发表时间的信息。我们在打开文章列表的页面时，应当对数据库中的文章进行查找，并对查询结果进行限制与忽略操作。取到10条信息，我们渲染到pug中。我们把文章的title作为url的query。那么怎么对时间进行排序呢？首先时间日期字段是存放在数据库中的，我们利用数据库哦不mongoose的排序查询方法。
	Query#sort(arg)
	Sets the sort order		// 进行排序
	Parameters:				// 参数
	arg <Object, String>	// 类型为对象或者数组
	Returns:				// 返回值
	<Query> this			// 返回上下文的一个队列
If an object is passed, values allowed are asc, desc, ascending, descending, 1, and -1.
If a string is passed, it must be a space delimited list of path names. The
sort order of each path is ascending unless the path name is prefixed with -
which will be treated as descending.
如果一个对象参数传入，那么值可以为倒序asc、正序desc、升序ascending、降序descending、1、-1等。
如果传入的是一个字符串，那么字符串必须用空格将查找的字段地址分开，排序默认为升序，除非字段名以-符号作为前缀，这时候就使用降序。
Example
	// sort by "field" ascending and "test" descending
	query.sort({ field: 'asc', test: -1 });
	
	// equivalent
	query.sort('field -test');
我们希望越新的文章排列的越靠前，所以我们的排序方式应该是降序，下面是修改后的函数代码：
	router.get('/', function (req, res, next) {
	    var articleNumber = 10;
	    var pages = 1; // 硬编码
	    blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
	        .then(function (blogs) {
	        console.log(blogs);
	        res.render('blog', {
	            blogs: blogs
	        });
	    });
	});
可以看到在控制台中输出已经成功排序。继续往下做。
另外还有我们的显示，当然可以写8个div把他们分别放进去，但是这不符合良好的代码习惯，很不程序员。我们希望能够代码复用，尽量没有重复的代码（虽然之前在pug里写的重复的代码就已经很多了，一直没有系统的学习pug，感觉很模糊）。所以还是要继续看一下pug。我们将最后的方法改为render并对blog.pug文件进行修改：
我们先不管之前的前端blog页面的blog.js文件的功能。将content的div下面添加如下代码进行尝试：
	#content
	  each blog in blogs
	    .blogItem
	      p= blog.title
能够成功的输出结果。
![](http://i.imgur.com/hY08pE9.png)
这样我们就可以开始对文章页面进行深入的修改。我们需要简洁的文章标题，我们需要一定长度的简介，我们需要对文章列表添加展开全文的功能等。
针对以上的几个问题，我们对pug代码进行以下修改。文章的标题比较好办，我们的原数据的title都是以一定格式保存的，同时我们知道我们的title中的数字是精确到秒的时间，这串数字不可能有重复。并且用_符号进行连接，我们的文章标题取最后一个_符号之后的内同比较合适，因为后边的内容就是我们上传博客文件时的文件名。另外还要去掉扩展名.md。然后我们对文章内容的前200个字进行截取作为前言（摘要？whatever）。对日期进行修整成正常人看时间的方式，这个可能关系到之前的时间存储方式，现在先不弄了。
	#content
	  each blog in blogs
	    .blogItem
	      h2= blog.title.split('_').pop().split('.').shift()
	      p= blog.category
	      p= blog.date.toLocaleString()
	      p= blog.content.substring(0, 200)
可以看到结果如下：
![](http://i.imgur.com/CYoSv3N.png)
虽然很丑，但是还能用。我们来看一下文章的链接怎么实现。我之前是想用文章标题中间的那一串数字作为独一无二的键来向后端发送。但是获得数字之后我们再去数据库查找文章不太方便。所以现在我想利用前端的js对文章的名称进行获取。等一下，做到这里我突然想到一个问题，我们是把8篇文章的数据都发送过来了，这样是在是太浪费资源流量了吧。所以我想把刚才做的那些从pug转到服务器，然后。。。。不对，我又懵了。我们的pug是经过编译之后才发送到客户端的，所以客户端显示什么，就占多少资源。嗯，那就没毛病了。继续做链接部分。我们给每个文章的选项添加一个特性，他的值就是我们的title。这样用户点击文正选项就可以发送回去文章的title，进而在数据库进行查询。然后我们修改blog.js的脚本代码，我们不让文章内容在.content中进行显示了，而是对显示简介的p元素进行展开。我在编写pug的过程中，webstorm总提示一些错，Attribute XXX is not allowed here.什么的，我直接忽略了，没啥影响。这里边唯一需要注意的地方就是获取当前元素的title并发送给后端，我一开始用的是getAttribute函数，但是没什么效果，据说是因为getAttribute()方法不能通过document对象调用，我们只能通过一个元素节点对象调用它。我把修改后的代码附上来：
前端blog.js：
	$(function () {
	    $('.blogItem').on('click', function () {
	        alert('我接收到了点击');
	        var index = $(this).attr('data-index');
	        alert($(this).attr('data-title'));
	        $.ajax({
	            type: 'POST',
	            url: '/blog/show',
	            data: {
	                title: $(this).attr('data-title')
	            },
	            dataType: 'json',
	            success: function (insertText) {
	                console.log(insertText.text);
	                document.getElementById('insertP' + index).innerHTML = insertText.text;
	            },
	            error: function () {
	                window.alert('未接受数据');
	            }
	        });
	    });
	});
blog.pug：
	extends layout
	
	block content
	  script(type='text/javascript', src='/javascripts/blog.js')
	  #content
	    each blog, index in blogs
	      .blogItem(data-title = blog.title, data-index = index, id=)
	        h2= blog.title.split('_').pop().split('.').shift()
	        p= blog.category
	        p= blog.date.toLocaleString()
	        p(id='insertP' + index)= blog.content.substring(0, 200)
后端blogServer.js：
	var express = require('express');
	var mongoose = require('mongoose');
	var markdown = require('markdown').markdown;
	var bluebird = require('bluebird');
	var blogs = require('../schema/blog');
	var router = express.Router();
	
	router.get('/', function (req, res, next) {
	    var articleNumber = 10;
	    var pages = 1; // 硬编码
	    blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
	        .then(function (blogs) {
	        res.render('blog', {
	            blogs: blogs
	        });
	    });
	});
	
	router.post('/show', function (req, res, next) {
	    var title = req.body.title;
	    blogs.findOne({
	        title: title
	    }, function (err, blog) {
	        var HTMLContent = markdown.toHTML(blog.content);
	        res.json({
	            text: HTMLContent
	        });
	    });
	});
	
	module.exports = router;
下面我们在重启服务器，已经成功了。这个功能就算结束了。



[http://blog.csdn.net/yczz/article/details/5978800](http://blog.csdn.net/yczz/article/details/5978800)
[https://docs.mongodb.com/manual/reference/method/cursor.sort/#sort-asc-desc](https://docs.mongodb.com/manual/reference/method/cursor.sort/#sort-asc-desc)
[http://blog.csdn.net/zk437092645/article/details/9345885](http://blog.csdn.net/zk437092645/article/details/9345885)
[http://mongoosejs.com/docs/api.html#query-js](http://mongoosejs.com/docs/api.html#query-js)
[http://www.w3school.com.cn/jquery/jquery_dom_get.asp](http://www.w3school.com.cn/jquery/jquery_dom_get.asp)
[http://www.cnblogs.com/dolphinX/p/3348458.html](http://www.cnblogs.com/dolphinX/p/3348458.html)
[http://www.w3school.com.cn/jquery/ajax_ajax.asp](http://www.w3school.com.cn/jquery/ajax_ajax.asp)
[http://www.w3school.com.cn/jquery/jquery_dom_get.asp](http://www.w3school.com.cn/jquery/jquery_dom_get.asp)
[http://blog.sina.com.cn/s/blog_780a942701012fqr.html](http://blog.sina.com.cn/s/blog_780a942701012fqr.html)
