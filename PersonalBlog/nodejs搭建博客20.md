---
title: nodejs搭建博客20
date: 2017-05-02 22:13:49
tags:
---


第二十篇了，正好博客的大体框架基本完成了。在这里贴一下代码，不是最终版，可能有错误，也不是很规范。最终完成之后我会加上注释：
前端代码：
1. admin.js
	$(function () {
	    var form1 = $('[name="fileform"]')[0];
	    $('#fileupload').on('click', function () {
	        var data = new FormData(form);
	        $.ajax({
	            type: 'POST',
	            url: '/upload/blog',
	            data: data,
	            cache: false,
	            processData: false,
	            contentType: false,
	            success: function () {
	                alert('上传成功');
	            }
	        });
	    });
	
	    var form2 = $('[name="momentsform"]')[0];
	    $('#pictureupload').on('click', function () {
	        var data = new FormData(form);
	        $.ajax({
	            type: 'POST',
	            url: '/upload/picture',
	            data: data,
	            cache: false,
	            processData: false,
	            contentType: false,
	            success: function () {
	                alert('上传成功');
	            }
	        });
	    });
	
	    $('#test').on('click', function () {
	        alert('clicked');
	        $.ajax({
	            type: 'GET',
	            url: '/admin/test'
	        });
	    });
	});
2. userFunction.js
	$(function () {
	    var $signin = $('#signin');
	    var $register = $('#register');
	    var $logout = $('#logout');
	    var $signinButton = $('#signin-button');
	    var $registerButton = $('#register-button');
	    var $enterBlog = $('#enter-blog');
	    var $introduce = $('#introduce');
	    var $index = $('#index');
	    var $formSignin = $('.form-signin');
	    var $formRegister = $('.form-register');
	    var $moreBlogs = $('.more-blogs');
	    var $prevBlogs = $('.prev-blogs');
	
	    $(document).ready(function () {
	        Tipped.create('#wechat', $('.move-into-tooltip[name="qr"]'),{
	            position: 'bottom',
	            behavior: 'mouse'
	        });
	        Tipped.create('#email', $('.move-into-tooltip[name="email"]'),{
	            position: 'bottom'
	        })
	    });
	
	    // 点击隐藏引导页，显示正文
	    $enterBlog.on('click', function () {
	        $introduce.hide();
	        $index.show();
	    });
	
	    // 点击链接切换到注册面板
	    $signin.find('a').on('click', function () {
	        $register.show();
	        $signin.hide();
	    });
	    // 点击链接切换到登陆面板
	    $register.find('a').on('click', function () {
	        $signin.show();
	        $register.hide();
	    });
	
	    $signin.on('click', function () {
	        $formSignin.css('opacity', '0.5');
	        $formRegister.css('opacity', '0');
	    });
	    $register.on('click', function () {
	        $formSignin.css('opacity', '0');
	        $formRegister.css('opacity', '0.5');
	    });
	
	    // 点击注册按钮注册
	    $registerButton.click(function (event) {
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
	                    $register.css('opacity', '0');
	                } else {
	                    window.alert(result.message);
	                }
	            }
	        });
	        event.preventDefault();
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
	                    $register.hide();
	                    $signin.hide();
	                    $logout.show();
	                } else {
	                    window.alert(result.message);
	                }
	            }
	        });
	        event.preventDefault();
	    });
	
	    $('.blog-item').on('click', function () {
	        var index = $(this).attr('data-index');
	        var now = $(this);
	        var $suspension = now.find('.suspension');
	        var $more = now.find('.more-content');
	        var $close = now.find('.close-content');
	
	        if (now.attr('expanded') === 'able') {
	            $.ajax({
	                type: 'POST',
	                url: '/showblog',
	                data: {
	                    title: $(this).attr('data-title')
	                },
	                dataType: 'json',
	                success: function (insertText) {
	                    document.getElementById('insertP' + index).innerHTML = insertText.text;
	                    now.attr('expanded', 'disabled');
	                    $suspension.hide();
	                    $more.hide();
	                    $close.show();
	                },
	                error: function () {
	                    window.alert('未接收数据');
	                }
	            });
	        }
	    });
	
	    $('.blog-item').find('.close-content').on('click', function (event) {
	        console.log('clicked');
	        var introduceText = $(this).prevAll('.main-body').text().substring(0, 200);
	        console.log($(this));
	        $(this).prevAll('.main-body').first().html(introduceText);
	        $(this).hide();
	        $(this).prev().show();
	        $(this).parent().attr('expanded', 'able');
	        event.stopPropagation();
	    });
	
	    function post(URL, PARAMS) {
	        var temp = document.createElement("form");
	        temp.action = URL;
	        temp.method = "post";
	        temp.style.display = "none";
	        for (var x in PARAMS) {
	            var opt = document.createElement("textarea");
	            opt.name = x;
	            opt.value = PARAMS[x];
	            // alert(opt.name)
	            temp.appendChild(opt);
	        }
	        document.body.appendChild(temp);
	        temp.submit();
	        return temp;
	    }
	
	    $moreBlogs.on('click', function (event) {
	        var pages = Number($(this).attr('data-pages').substring(5));
	        /* 不能用ajax！
	        $.ajax({
	            type: 'POST',
	            url: '/moreblog',
	            data: {
	                pages: pages
	            },
	            success: function (result) {
	                console.log(result);
	            }
	        });
	        */
	        post('/changeblog', {
	            pages: pages,
	            direction: 'next'
	        });
	    });
	
	    $prevBlogs.on('click', function () {
	        var pages = Number($(this).attr('data-pages').substring(5));
	        post('/changeblog', {
	            pages: pages,
	            direction: 'prev'
	        })
	    })
	});
CSS：
index.css
	#introduce {
	    height: 100vh;
	    width: 100vw;
	    background-color: #222;
	    background-image: url('/images/introduce.jpg');
	    background-repeat: no-repeat;
	    background-size: cover;
	    color: #bbb
	}
	#introduce .resume {
	    position: relative;
	    top: 24vh;
	    margin: 0 auto;
	    padding: 0 14px;
	    width: 300px;
	    height: auto;
	    background-color: rgba(2, 2, 2, 0.3);
	    border-radius: 8px;
	    overflow: hidden;
	    font-family: SimSuncss, NSimSun, FangSong, sans-serif;
	}
	#introduce .resume:hover {
	    color: #fff;
	    font-weight: bold;
	}
	#introduce .resume h3 {
	    margin: 40px 0 40px 10px;
	    text-align: center;
	    font-size: 40px;
	    letter-spacing: 10px;
	}
	#introduce .resume p {
	    margin: 15px auto;
	    text-align: center;
	    font-size: 20px;
	    letter-spacing: 3px;
	}
	#introduce .resume ul {
	    padding: 0;
	    text-align: center;
	    display: table;
	    width: 100%;
	}
	#introduce .resume ul li {
	    display: inline-block;
	    margin: 0 10px 0 6px;
	    list-style-type: none;
	    letter-spacing: 4px;
	}
	#introduce .move-into-tooltip {
	    display: none;
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
	.qrcode {
	    width: 120px;
	    height: 120px;
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
	#introduce .user ul #logout {
	    display: none;
	}
	#introduce .user ul li form input, button {
	    margin: 0 0 0 10px;
	}
	#introduce {
	    display: none;// #introduce
	}
	.header {
	    width: 100%;
	    height: auto;
	    display: none;
	}
	.content {
	    background-color: #ddd;
	    margin: 0;
	    border: 0;
	    width: 100%;
	    overflow:hidden
	}
	#left-section {
	    float: left;
	    clear: both;
	    padding: 0;
	}
	#right-section {
	    float: right;
	    width: 70vw;
	    margin: 0;
	    padding: 0 24px 0 44px;
	    overflow: hidden;
	}
	#left-container {
	    background-color: #eeeeee;
	    padding: 20px;
	    height: 100%;
	    width: 30vw;
	    overflow: hidden;
	    position: fixed;
	    font-family: SimSuncss, NSimSun, FangSong, sans-serif;
	    color: #444;
	}
	#right-container {
	    //background-color: #eeeeee;
	    //margin: 0 20px 0 40px;
	    //padding: 30px;
	    //overflow: hidden;
	
	}
	#information {
	    margin-top: 0;
	    height: 50%;
	    overflow:hidden
	}
	#information .title h1 {
	    text-align: center;
	    margin: 60px 20px 60px 28px;
	    font-size: 40px;
	    color: #666;
	    letter-spacing: 8px;
	}
	#information .name h4 {
	    text-align: center;
	    margin: 20px auto;
	    letter-spacing: 2px;
	}
	#information .signature p {
	    text-align: center;
	    letter-spacing: 1px;
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
	#moments .moods {
	    width: 100%;
	    height: 100%;
	}
	#moments .moods p {
	    text-align: center;
	    vertical-align: middle;
	    margin: 10px auto;
	    letter-spacing: 1px;
	}
	.blog-item {
	    background-color: #eee;
	    overflow: hidden;
	    padding: 10px 25px 20px 25px;
	    margin: 0 0 25px 0;
	    color: #555;
	}
	.head-bar {
	    width: 20%;
	    height: 6px;
	    background-color: #2e6da4;
	    margin: 25px 0 0 0 ;
	}
	.blog-item h2 {
	    margin: 24px 0;
	    font-family: SimSuncss, NSimSun, FangSong, sans-serif;
	}
	.blog-item .detail {
	    display: block;
	    overflow: hidden;
	    margin: 12px 0 8px 0;
	}
	.blog-item .detail .category,.date {
	    display: inline-block;
	    font-family: SimSuncss, NSimSun, FangSong, sans-serif;
	    font-size: 20px;
	}
	.blog-item .detail .category {
	    float: left;
	}
	.blog-item .detail .date {
	    float: right;
	
	}
	.blog-item .main-body {
	    //background: linear-gradient(rgba(238,238,238,0),rgba(238,238,238,1));
	    //z-index: -100;
	    font-family: Microsoft YaHei, STHeiti Light, Consolas, sans-serif;
	    font-size: 20px;
	}
	.blog-item .main-body hr {
	    margin: 0;
	}
	.blog-item .more-content,.close-content {
	    text-align: center;
	    color: #2e6da4;
	    font-size: 20px;
	    font-weight: 800;
	}
	.blog-item .close-content {
	    display: none;
	}
	.blog-item .main-body p,span {
	    margin: 0;
	}
	.blog-item .close-content a  {
	    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	    font-weight: 800;
	    text-decoration: none;
	}
	.more-blogs,.prev-blogs {
	    margin: 0 auto 10px auto;
	    padding: 15px;
	    color: #2e6da4;
	    text-align: center;
	    font-size: 20px;
	    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	    font-weight: 800;
	}
	.more-blogs {
	    background: linear-gradient(rgba(238,238,238,1),rgba(238,238,238,0));
	}
	.prev-blogs {
	    //display: none;
	    background: linear-gradient(rgba(238,238,238,0),rgba(238,238,238,1));
	}
SERVER：
indexServer.js
	var express = require('express');
	var app = require('../app');
	var mongoose = require('mongoose');
	var markdown = require('markdown').markdown;
	var bluebird = require('bluebird');
	var blogs = require('../schema/blog');
	var router = express.Router();
	
	router.get('/', function (req, res, next) {
	    var pages = 1;
	    var articleNumber = 8;
	    console.log('我是get');
	    blogs.count().then(function (count) {
	        var lastPage = Math.ceil(count / articleNumber);
	        blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
	            .then(function (blogs) {
	                console.log('当前的pages是：' + pages);
	                res.render('index', {
	                    blogs: blogs,
	                    pages: pages,
	                    lastPage: lastPage,
	                    showSignin: app.SendInfo.showSignin,
	                    showRegister: app.SendInfo.showRegister,
	                    showInformation: app.SendInfo.showInformation,
	                    username: app.SendInfo.username,
	                    isAdmin: app.SendInfo.isAdmin
	                });
	            });
	    })
	});
	
	router.post('/changeblog', function (req, res, next) {
	    var pages = 0;
	    if (req.body.pages) {
	        pages = Number(req.body.pages);
	    }
	    if (req.body.direction === 'prev') {
	        pages -= 1;
	    } else if (req.body.direction === 'next') {
	        pages += 1;
	    }
	    console.log('我的页数是 ' + pages);
	    var articleNumber = 8;
	    blogs.count().then(function (count) {
	        var lastPage = Math.ceil(count / articleNumber);
	        blogs.find().limit(articleNumber).skip(articleNumber * (pages - 1)).sort('-date')
	            .then(function (blogs) {
	                res.render('index', {
	                    blogs: blogs,
	                    pages: pages,
	                    lastPage: lastPage,
	                    showSignin: app.SendInfo.showSignin,
	                    showRegister: app.SendInfo.showRegister,
	                    showInformation: app.SendInfo.showInformation,
	                    username: app.SendInfo.username,
	                    isAdmin: app.SendInfo.isAdmin
	                });
	            });
	    })
	});
	
	router.post('/showblog', function (req, res, next) {
	    //console.log('我已经接收到请求了' + req.body);
	    var title = req.body.title;
	    console.log(title);
	    blogs.findOne({
	        title: title
	    }, function (err, blog) {
	        //console.log(blog);
	        var HTMLContent = markdown.toHTML(blog.content);
	        //console.log(HTMLContent);
	        res.json({
	            text: HTMLContent
	        });
	        console.log("我发送数据了");
	    });
	});
	
	module.exports = router;
adminServer:
	var express = require('express');
	var app = require('../app');
	var mongoUsers = require('../schema/user');
	var bluebird = require('bluebird');
	var router = express.Router();
	

	router.get('/', function (req, res, next) {

	    var itemNumber = 4;
	    var currentPage = 1;
	    if (req.query.page) {
	        //console.log(req.query.page);
	        currentPage = req.query.page;
	    }
	    mongoUsers.count()
	        .then(function (count) {
	            var lastPage = Math.ceil(count / itemNumber);
	            mongoUsers.find().limit(itemNumber).skip(itemNumber * (currentPage - 1)).then(function (users) {
	                //console.log('注意，这不是演习！前方高能！');
	                //console.log(users);
	                //console.log('lastPage = ' + lastPage, 'currentPage = ' + currentPage);
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
	
	router.get('/test', function (req, res, next) {
	    res.write('TEST');
	});
	
	module.exports = router;
index.pug:
	extends layout
	
	block content
	  script(type='text/javascript', src='/javascripts/tipped.js')
	  script(type='text/javascript', src='/javascripts/bootstrap.js')
	  script(type='text/javascript', src='/javascripts/userFunction.js')
	  link(href='/stylesheets/bootstrap.css', rel='stylesheet', type='text/css')
	  link(href='/stylesheets/normalize.css', rel='stylesheet', type='text/css')
	  link(href='/stylesheets/tipped.css', rel='stylesheet', type='text/css')
	  link(href='/stylesheets/index.css', rel='stylesheet', type='text/css')
	  #introduce
	    .resume
	      h3 浮生六记
	      p 李岩翔
	      ul
	        li#enter-blog 博客
	        li#wechat 微信
	        li#email 邮箱
	        li 待定
	      .move-into-tooltip(name='qr')
	        img.qrcode(src='/images/QRCode.jpg')
	      .move-into-tooltip(name='email')
	        a.click-to-close(href='mailto:liyanxiang@mail.dlut.edu.cn') liyanxiang@mail.dlut.edu.cn
	    .user
	      ul
	        if showSignin
	          li#signin
	            p 登陆
	            form.form-signin
	              input(type='text', name='username', placeholder='请输入用户名')
	              input(type='password', name='password', placeholder='请输入密码')
	              button#signin-button 登录
	        if showRegister
	          li#register
	            p 注册
	            form.form-register
	              input(type='text', name='username', placeholder='请输入用户名')
	              input(type='password', name='password', placeholder='请输入密码')
	              input(type='repassword', name='repassword', placeholder='请再次输入密码')
	              button#register-button 注册
	        if showInformation
	          li#logout
	            if isAdmin
	              | 您好，管理员#{username}
	            else
	              | 您好，#{username}
	            a.other(href='/userFunctionServer/logout') 点击注销
	  #index
	    .content
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
	      #right-section
	        script(type='text/javascript', src='/javascripts/blog.js')
	        #content
	          if (pages !== 1)
	            .prev-blogs(data-pages = 'pages' + pages)
	              span.icon-paragraph-left
	              | PREV BLOGS
	          each blog, index in blogs
	            .head-bar
	            .blog-item(data-title = blog.title, data-index = index, expanded='able', id='blog-item' + index)
	              h2= blog.title.split('_').pop().split('.').shift()
	              .detail
	                p.category 标签：#{blog.category}
	                p.date= blog.date
	              p.main-body(id = 'insertP' + index) #{blog.content.substring(0, 200)}<span class='suspension'>......</span>
	              .more-content
	                | EXPAND
	                span.glyphicon.glyphicon-chevron-right
	              .close-content
	                a(href='#blog-item' + index)
	                  span.glyphicon.glyphicon-chevron-left
	                  | CLOSE
	          if (pages !== lastPage)
	            .more-blogs(data-pages = 'pages' + pages)
	              span.icon-paragraph-left
	              | MORE BLOGS