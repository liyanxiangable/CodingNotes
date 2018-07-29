---
title: nodejs搭建博客15
date: 2017-04-29 15:27:39
tags:
---

继续码。上篇已经修改了index.pug与userFunction.js的基本内容。我把blog.pug的模板放到了index里，现在应该修改后端，不然得不到blog文章。后头想想，之前的blogSever是可以接受一个/blog请求，渲染页面，然后点击文章再发送文章内容。现在这样不行了，因为之前是路由到/blog页面，我现在是/index页面。也就是说当对index页面发送请求时，就应该由后端把文章的列表发送到前端。所以我把blogSever的接收'/blog'请求的函数与index.js的接收'/'请求这两个函数合并成为一个，当然，相应的模块也应该引入。这样的话index.js文件如下，给它取个新名，叫indexServer：

	var express = require('express');
	var app = require('../app');
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
	                blogs: blogs,
	                showSignin: app.SendInfo.showSignin,
	                showRegister: app.SendInfo.showRegister,
	                showInformation: app.SendInfo.showInformation,
	                username: app.SendInfo.username,
	                isAdmin: app.SendInfo.isAdmin
	            });
	        });
	});
	
	module.exports = router;
没有博客输出，想了想昨天手残不小心在可视化mongodb工具中把博客集合删了，那现在我先上传足够多的博客。上传十多篇文章之后，我们再来看下，完美运行了。嗯，如下图：
![](http://i.imgur.com/MllKRCT.png)
但是，暴露出来一个问题，我们的文章点击展开后，此时再点击文章，他又重新加载一次。这是个小坑，我们回头修改前端页面。另外还有小毛病，注意到文章结尾的参考链接，有的链接比较短的不另起一行。含有就是ajax回调函数这里。最后文章的标签不好看，时间太别扭，这里都应该一点一点地修改。哦，还有文章的右侧被滚动条挡住了半行。

我先来做登陆与注册，把index的div改回display:none。现在我们显示的是纯色，我想改成一个背景图片，不是说纯色的不好看，而是纯色的弄不好就会给人一种windows2000的桌面感觉，而我有没有时（天）间（份）折腾配色。参考阮一峰老师的网站，他那个每点击屏幕一下，就会换一张图。我猜他是用ajax对某个图片api进行请求。那么在哪里可以找到这样的api呢？经过一番百度之后，找到了它http://lorempixel.com/，质量不是很高，很多时候与我们的文字颜色冲突。但是还有个问题，就是我们怎么让图片适应屏幕大小呢，我们的屏幕大小都不一致，然而给出的图片的分辨率却是一定的。background-image这个css设置图像的平铺。但是不能拉伸，好惆怅。background-size：cover，这个 CSS3 的属性作用是把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。这样就好些了。现在是可以用，但是效果不太好，我们没有办法来控制文字与图片的颜色。我还是自己上传几张图片作为引导页好了。
继续处理关于登陆注册。修改index.pug如下。

	.user
	  ul
	    li#signin
	      p 登陆
	      form.form-signin
	        input(type='text', name='username', placeholder='请输入用户名')
	        input(type='password', name='password', placeholder='请输入密码')
	        button#signin-button 登录
	    li#register
	      p 注册
	      form.form-register
	        input(type='text', name='username', placeholder='请输入用户名')
	        input(type='password', name='password', placeholder='请输入密码')
	        input(type='repassword', name='repassword', placeholder='请再次输入密码')
	        button#register-button 注册
然后修改css样式让他更美观一些

	#introduce .resume ul {
	    padding: 0;
	    text-align: center;
	}
	#introduce .resume ul li {
	    display: inline-block;
	    margin: 0 10px;
	    list-style-type: none;
	}
	#introduce .user {
	    position: absolute;
	    top: 80vh;
	    display: inline-block;
	    margin: 0 auto;
	}
	#introduce .user ul {
	    float: left;
	    margin: 0 20px 0 0;
	}
	#introduce .user ul li {
	    list-style-type: none;
	    color: #aaa;
	    margin-bottom: 10px;
	}
	#introduce .user ul li p:hover {
	    color: #fff;
	}
	#introduce .user ul li p {
	    display: inline-block;
	}
	#introduce .user ul li form {
	    width: 800px;
	    display: inline-block;
	    margin: 0 10px;
	    opacity: 0;
	}
	#introduce .user ul li form input, button {
	    margin: 0 0 0 10px;
	}
然后利用js对其增加透明切换显示效果，把登陆与注册的功能用原来的代码稍加修改：

    $signin.on('click', function () {
        $formSignin.css('opacity', '1');
        $formRegister.css('opacity', '0');
    });
    $register.on('click', function () {
        $formSignin.css('opacity', '0');
        $formRegister.css('opacity', '1');
    });

    // 点击注册按钮注册
    $registerButton.on('click', function () {
        $.ajax({
            type: 'post',
            url: '/userFunctionServer/register',
            data: {
                username: $register.find('[name="username"]').val(),
                password: $register.find('[name="password"]').val(),
                repassword: $register.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                if (!result.code) {
                    window.alert(result.message + ' ' + result.code);
                } else {
                    window.alert(result.message);
                }
            }
        });
    });

    // 点击登录按钮登录
    $signinButton.on('click', function () {
        $.ajax({
            type: 'post',
            url: '/userFunctionServer/signin',
            data: {
                username: $signin.find('[name="username"]').val(),
                password: $signin.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function (result) {
                if (!result.code) {
                    window.alert(result.message);
                } else {
                    window.alert(result.message);
                }
            }
        });
    });
这时候发现了一个问题，怎么页面就进行刷新了呢？我花了好长时间到底是哪里发出的请求，前端后端都找了。最后才想起来，是默认事件发起的请求。注意看上边的代码，他是监听了一个点击事件，然后对事件进行响应。也就是说点击按钮之后，不光是进行ajax请求，button默认的事件也发生了。所以对页面进行了刷新。我们修改代码，让点击阻止按钮的默认事件。局部代码如下：

    $registerButton.click(function (event) {
        event.preventDefault();
	}
这样就可以了。但是还是有问题，因为我们登陆或者注册了，就不希望还显示登陆选项与注册选项了。继续对代码进行改进，我们将登陆成功后的登录与注册隐藏，显示（新写的pug）注销，注册成功之后隐藏注册：

    $register.css('opacity', '0');
    $signin.css('opacity', '0');
但是现在这两行代码并没有效果，检查一下。首先register与signin都是在ul中的li，然后将他们的透明度改成0，虽然这么做不太好，但是逻辑上好像没有错误。换成hide函数试试。晕死了，不是这里的事，还是之前的默认事件，我只给注册加了，忘了给登陆加。。。。。看到这两个li还在那里是因为页面刷新了。




参考链接：

1. [http://lorempixel.com/](http://lorempixel.com/)
2. [http://placehold.it/](http://placehold.it/)
3. [https://www.zhihu.com/question/23346183](https://www.zhihu.com/question/23346183)
4. [http://www.w3school.com.cn/cssref/pr_background-image.asp](http://www.w3school.com.cn/cssref/pr_background-image.asp)
5. [http://www.w3school.com.cn/cssref/pr_background-repeat.asp](http://www.w3school.com.cn/cssref/pr_background-repeat.asp)
6. [http://www.jb51.net/css/221348.html](http://www.jb51.net/css/221348.html)
7. [https://www.giuem.com/](https://www.giuem.com/)
8. [http://www.w3school.com.cn/cssref/pr_opacity.asp](http://www.w3school.com.cn/cssref/pr_opacity.asp)