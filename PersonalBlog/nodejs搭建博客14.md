---
title: nodejs搭建博客14
date: 2017-04-28 23:13:03
tags:
---

# 我们现在来写前端页面
要先想想怎么布置我们的页面。

1. 一打开我们博客，有一个引导页。简洁风格。有若干个链接，分别指向各种，email啊，微信啊，知乎啊，博客啊，低调显示登陆与注册。
2. 进入博客，就像那个hexo的yilia主题分左右两栏，左侧分三小块，分别显示个人信息的基本内容、一条最近的状态与一张照片的缩略图，这里固定不动；然后右边是博客列表，可以滚动。
3. 左栏中的个人信息基本内容点击可以展开，占满左栏整个大小（也就是此时状态与照片隐藏）。同理。状态也可以点击展开占满，并且此时可以滚动显示更多条（比如说我们之前博客规定的8篇），滚动到第八篇之后，显示箭头，可以点击更新。照片与状态同理。但是这里有一个问题就是，状态有可能带着照片。嗯，这里还是像之前想的那样，把状态与照片合在一起吧。
4. 另外还有几个需求，就是进入之后的注册登录，搜索，实验室，技能树等。

先来实现这几个需求。

首先一个引导页面，我的想法是有一个占满整个屏幕的div，作为引导页。一开始的时候其他的内容都隐藏，然后只显示这个div，点击进入博客的时候，此div隐藏，其他内容显示。

嗯，我们先引入清除样式css，再利用设置高度与宽度的vh、vw单位对引导div的大小进行设置。

	#introduce {
	    height: 100vh;
	    width: 100vw;
	    background-color: #afd9ee;
	}
然后对其他的元素进行隐藏。

	.index {
	    display: none;
	}
我们在引导页中加入个人简介，与登陆注册两个区域。每一步的代码不贴了，都很简单，随后贴上总的。
将个人简介的布局制作好，css如下，当然还有要进行很多的细节改进，我们先做布局，最后再做细节样式。
pug模板如下：
	
	#introduce
	  .resume
	    h3 浮生六记
	    p 李岩翔
	    p 大连理工大学
	    ul
	      li#enter-blog 博客
	      li 微信
	      li 邮箱
	      li 没想好
	  .user
	    ul
	      li 登陆
	      li 注册
并且把之前的那些index中的内容都放到了#index的div里。

	#introduce {
	    height: 100vh;
	    width: 100vw;
	    background-color: #afd9ee;
	}
	#introduce .resume {
	    position: relative;
	    top: 24vh;
	    margin: 0 auto;
	    padding: 22px 14px;
	    width: 300px;
	    height: auto;
	    background-color: rgba(2, 2, 2, 0.2);
	}
	#introduce .resume h3 {
	    margin: 10px auto;
	    text-align: center;
	}
	#introduce .resume p {
	    margin: 10px auto;
	    text-align: center;
	    font-size: 16px;
	}
	#introduce .resume ul {
	    padding: 0;
	    text-align: center;
	}
	#introduce .resume ul li {
	    display: inline-block;
	    margin: 0 10px;
	}
	.index {
	    display: none;
	}
我们给博客那里添加点击事件，让他能够显示出博客页面，我们下面修改并续写userFunction.js：

    var $enterBlog = $('#enter-blog');
    var $introduce = $('#introduce');
    var $index = $('#index');

    // 点击隐藏引导页，显示正文
    $enterBlog.on('click', function () {
        $introduce.hide();
        $index.show();
    });
我们现在的正文就不要了，感觉与我低调有内涵的风格不符。我们需要对index.pug进行很大的修改：
注意有个垂直外边距合并问题，这个要处理一下，我是将超出边距的元素的父元素的css设置overflow:hidden。另外再用栅栏布局的时候，我们的margin会把后边的div挤到下边去，我们很多时候想要水平方向的几栏之间又希望留有空隙。所以可以在栅栏里边建立一个div盛放内容并给他设置margin。然后我们左边的区域是“固定”的，对他进行position的fixed设置。遇到了一个问题，position:fixed与栅栏布局好像不能同时使用。我从网上没找到相关内容，那现在就不使用栅栏布局了。我们自己手写所有的布局。这样的话我们利用浮动按照黄金比例来分成左右两栏。但是父元素就没有别的内容从而坍缩了，有几种解决办法。常用的是对父元素加入overflow:hidden，或是在塌陷的父元素的最后一个子元素中添加样式clear:both。我们调整好之后，将左栏的内容进行修改，把之前的登陆框，注册框、社区、信息框去掉。换成个人信息与状态。
由于有些功能我还没有做，所以有些地方暂时先硬编码，等解决了后端的问题，再使用模板等动态生成页面。
所以现在的左侧栏是这个样子的：

    #left-section
      #left-container
        #information
          .title
            h1 浮生六记
          .name
            h4 李岩翔
          .signature
            p
              | 弃捐勿复道
              | 努力加餐饭
          .br
        #moments
          .picture
            img(src='/images/pic01.jpg')
          .moods
            p 欲买桂花同载酒，终不似，少年游
修改了pug之后我们也应当对css样式进行相应的修改。

	#introduce {
	    height: 100vh;
	    width: 100vw;
	    background-color: #afd9ee;
	}
	#introduce .resume {
	    position: relative;
	    top: 24vh;
	    margin: 0 auto;
	    padding: 22px 14px;
	    width: 300px;
	    height: auto;
	    background-color: rgba(2, 2, 2, 0.2);
	}
	#introduce .resume h3 {
	    margin: 10px auto;
	    text-align: center;
	}
	#introduce .resume p {
	    margin: 10px auto;
	    text-align: center;
	    font-size: 16px;
	}
	#introduce .resume ul {
	    padding: 0;
	    text-align: center;
	}
	#introduce .resume ul li {
	    display: inline-block;
	    margin: 0 10px;
	}
	#introduce {
	    display: none;// #index
	}
	.header {
	    width: 100%;
	    height: auto;
	    display: none;
	}
	.content {
	    background-color: #8c8c8c;
	    margin: 0;
	    border: 0;
	    width: 100%;
	    overflow:hidden
	}
	#left-section {
	    float: left;
	    clear: both;
	    margin-right: 30px;
	    padding: 0;
	}
	#right-section {
	    float: right;
	    width: 62vw;
	}
	#left-container {
	    background-color: #eeeeee;
	    padding: 20px;
	    height: 100%;
	    width: 36vw;
	    overflow: hidden;
	    position: fixed;
	}
	#right-container {
	    background-color: #eeeeee;
	    margin-left: 30px;
	    padding: 20px;
	    width: 100%;
	    height: 100%;
	    overflow: hidden;
	}
	#information {
	    margin-top: 0;
	    height: 50%;
	    overflow:hidden
	}
	#information .title h2 {
	    text-align: center;
	    margin: 60px auto;
	}
	#information .name h4 {
	    text-align: center;
	    margin: 20px auto;
	}
	#information .signature p {
	    text-align: center;
	}
	.br {
	    height: 2px;
	    width: 100%;
	    margin: 0 auto;
	    background-color: #9d9d9d;
	}
	#moments {
	    margin: 10px;
	}
	#moments .picture {
	    width: 80%;
	    height: 60%;
	    display: table-cell;
	}
	#moments .picture img {
	    max-width: 100%;
	    max-height: 100%;
	    text-align: center;
	    vertical-align: middle;
	}
	#moments .moods p {
	    text-align: center;
	    vertical-align: middle;
	    margin: 10px auto;
	}
然后就是右侧博客栏。我在这里把blog.pug的模板放到这里来。我们之前的把博客页单独拿出来的做法不是很方便。

	#content
	  each blog, index in blogs
	    .blogItem(data-title = blog.title, data-index = index, id=)
	      h2= blog.title.split('_').pop().split('.').shift()
	      p= blog.category
	      p= blog.date.toLocaleString()
	      p(id='insertP' + index)= blog.content.substring(0, 200)
改了pug的内有就会出现之前的js对不上号的情况，现在我来修改userFunction.js文件。我们到现在还没有处理登录注册的功能，因为我还没想好从引导页进入之后从哪里添加这个功能。这里先放一放，我想一个页面有太多东西实在是不符合简约风格，我准备就摆两个入口，然后点击弹出新的小窗口这样。所以这个东西以后再说。
我们把blog.js的函数集成到userFunction.js中去。

	$(function () {
	    var $signin = $('#signin');
	    var $register = $('#register');
	    var $information = $('#information');
	    var $enterBlog = $('#enter-blog');
	    var $introduce = $('#introduce');
	    var $index = $('#index');
	
	    $('.blogItem').on('click', function () {
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

参考链接：

[http://ontheway.im/](http://ontheway.im/)
[http://litten.me/](http://litten.me/)
[http://www.ruanyifeng.com/home.html](http://www.ruanyifeng.com/home.html)
[http://bbs.blueidea.com/thread-3039066-1-1.html](http://bbs.blueidea.com/thread-3039066-1-1.html)
[http://www.w3school.com.cn/css/css_margin_collapsing.asp](http://www.w3school.com.cn/css/css_margin_collapsing.asp)
[https://my.oschina.net/sencha/blog/490321](https://my.oschina.net/sencha/blog/490321)