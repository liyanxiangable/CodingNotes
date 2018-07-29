---
title: nodejs搭建博客6
date: 2017-04-22 15:25:57
tags:
---


气死了，这篇文章本来已经洋洋洒洒写完了可是没保存还是怎么着，空了。下午三点多做到晚上九点，全没了ヽ(●-`Д´-)ノ为了保持连贯性，重新写。。。
算了，不重新写了。就光把代码贴上吧：
app.js:

	var express = require('express');
	var path = require('path');
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	
	var index = require('./routes/index');
	var users = require('./routes/users');
	var userFunctionSever = require('./routes/userFunctionServer');
	
	var app = express();
	
	// C:\Users\liyanxiang\WebstormProjects\site\db
	mongoose.connect('mongodb://localhost/27017');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
	    console.log("Mongodb has been connected!");
	});
	
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	
	// uncomment after placing your favicon in /public
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.use(function (req, res, next) {
	    console.log('执行cookies自定义中间件');
	    userInfo = {};
	    if (req.cookies.userInfo) {
	        console.log('欢迎回来，' + req.cookies.userInfo.username);
	        userInfo.username = req.cookies.userInfo.username;
	        userInfo.password = req.cookies.userInfo.password;
	        userInfo.errorCode = req.cookies.userInfo.errorCode;
	    } else {
	        console.log('无用户信息cookies');
	    }
	    next();
	});
	var viewSetter = {
	    showRegister: false,
	    showSignin: true,
	    showInformation: false
	};
	app.use(function (req, res, next) {
	    console.log('正在执行定义视图中间件');
	
	    if (userInfo.username) {
	        viewSetter.showSignin = false;
	        viewSetter.showInformation = true;
	    } else if (userInfo.errorCode >= 10 && userInfo.errorCode < 20) {
	        viewSetter.showRegister = true;
	        viewSetter.showSignin = false;
	    }
	    console.log(viewSetter);
	    next();
	});
	
	app.use('/', index);
	app.use('/users', users);
	app.use('/userFunctionServer', userFunctionSever);
	
	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
	
	// error handler
	app.use(function (err, req, res, next) {
	    // set locals, only providing error in development
	    res.locals.message = err.message;
	    res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	    // render the error page
	    res.status(err.status || 500);
	    res.render('error');
	});
	app.listen(5000);
	
	module.exports = app;
	exports.viewSetter = viewSetter;
index.js

	var express = require('express');
	var app = require('../app');
	var router = express.Router();
	
	/* GET home page. */
	router.get('/', function(req, res, next) {
	    console.log('showSignin: ' + app.viewSetter.showSignin);
	    console.log('showRegister: ' + app.viewSetter.showRegister);
	    console.log('showInformationn: ' + app.viewSetter.showInformation);
	    res.render('index', {
	        showSignin: app.viewSetter.showSignin,
	        showRegister: app.viewSetter.showRegister,
	        showInformation: app.viewSetter.showInformation
	    });
	});
	
	module.exports = router;
userFunction.js
	$(function () {
	    var $signin = $('#signin');
	    var $register = $('#register');
	    var $information = $('#information');
	
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
	
	    // 点击注册按钮注册
	    $register.find('button').on('click', function () {
	        // 通过ajax提交请求
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
	                // 如果注册成功
	                if (!result.code) {
	                    window.alert(result.message + ' ' + result.code);
	                } else {
	                    // 注册不成功，提示注册错误信息
	                    window.alert(result.message);
	                }
	            }
	        });
	    });
	
	    // 点击登录按钮登录
	    $signin.find('button').on('click', function () {
	        // 通过ajax提交请求
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
	                    window.location.reload();
	                } else {
	                    // 如果登陆不成功，提示登陆错误信息
	                    window.alert(result.message);
	                }
	            }
	        });
	    });
	});
index.jade

	extends layout
	
	block content
	  script(type='text/javascript', src='/javascripts/userFunction.js')
	  head
	    meta(charset='UTF-8')
	    title 初始页面
	  body
	    .header
	      .picture
	        img(src='/images/pic01.jpg', alt='顶部图片')
	      nav
	        ul
	          li.active
	            a.navigation(href='#') 首页
	          li
	            a.navigation(href='#') 苏轼
	          li
	            a.navigation(href='#') 辛弃疾
	          li
	            a.navigation(href='#') 晏殊
	          li
	            a.navigation(href='#') 柳永
	          li
	            a.navigation(href='#') 李清照
	    .content
	      .container
	        .row
	          .col-md-8.col-lg-8
	            .item
	              h2.item-title  西江月呵呵
	              p.item-detail 作者: 时间: 阅读: 评论:
	              p.item-summary
	                | 三十三年，今谁存者？算只君与长江。凛然苍桧⑶，霜干苦难双。闻道司州古县⑷，云溪上、竹坞松窗⑸。江南岸，不因送子，宁肯过吾邦⑹？
	                | 摐摐⑺，疏雨过，风林舞破⑻，烟盖云幢⑼。愿持此邀君，一饮空缸⑽。居士先生老矣⑾，真梦里、相对残釭⑿。歌声断，行人未起，船鼓已逢逢⒀。
	              button.article 阅读全文
	            .item
	              h2.item-title 水龙吟·次韵章质夫杨花词
	              p.item-detail 作者: 时间: 阅读: 评论:
	              p.item-summary
	                | 似花还似非花，也无人惜从教坠⑶。抛家傍路，思量却是，无情有思⑷。萦损柔肠⑸，困酣娇眼⑹，欲开还闭。梦随风万里，寻郎去处，又还被、莺呼起⑺。
	                | 不恨此花飞尽，恨西园、落红难缀⑻。晓来雨过，遗踪何在？一池萍碎⑼。春色三分⑽，二分尘土，一分流水。细看来，不是杨花，点点是离人泪。
	              button.article 阅读全文
	            .item
	              h2.item-title 满江红 · 寄鄂州朱使君寿昌
	              p.item-detail 作者: 时间: 阅读: 评论:
	              p.item-summary
	                | 江汉 3 西来，高楼 4 下、蒲萄 5 深碧。犹自带，岷峨 6 雪浪，锦江 7 春色。君是南山 8 遗爱 9 守，我为剑外 10 思归客。对此间、风物岂无情，殷勤说。
	                | 《江表传》11，君休读；狂处士 12，真堪惜。空洲对鹦鹉 13，苇花萧瑟。不独笑书生争底事，曹公黄祖 14 俱飘忽。愿使君、还赋谪仙 15 诗，追黄鹤 16。
	              button.article 阅读全文
	            .item
	              h2.item-title 一丛花·初春病起
	              p.item-detail 作者: 时间: 阅读: 评论:
	              p.item-summary
	                | 今年春浅腊侵年⑵，冰雪破春妍⑶。东风有信无人见⑷，露微意、柳际花边。寒夜纵长，孤衾易暖⑸，钟鼓渐清圆⑹。
	                | 朝来初日半衔山，楼阁淡疏烟。游人便作寻芳计⑺，小桃杏、应已争先。衰病少悰⑻，疏慵自放⑺，惟爱日高眠。
	              button.article 阅读全文
	          .col-md-4.col-lg-4
	            if showInformation
	              #information.item
	                .info-title
	                  h3 用户信息
	                  .hr
	                .information-detail
	                  | 您好，您是管理员
	                  br
	                  a.other(href='/userFunctionServer/logout') 点击此处注销
	            if showRegister
	              #register.item
	                .info-title
	                  h3 注册
	                  .hr
	                .register-detail
	                  | 用户名：
	                  input(name='username', type='text', placeholder='请输入6位以上字母或数字')
	                  br
	                  |                         密码：
	                  input(name='password', type='password', placeholder='6至10位字母或数字')
	                  br
	                  |                         确认密码：
	                  input(name='repassword', type='password', placeholder='6至10位字母或数字')
	                  br
	                  button 注册
	                .other
	                  | 已有账号？
	                  a(href='javascript:;') 点此登录
	            if showSignin
	              #signin.item
	                .info-title
	                  h3 登陆
	                  .hr
	                .signin-detail
	                  | 用户名：
	                  input(type='text', placeholder='请输入6位以上字母或数字', name='username')
	                  br
	                  |                         密码：
	                  input(type='password', placeholder='6至10位字母或数字', name='password')
	                  br
	                  button 登陆
	                .other
	                  | 没有账号？
	                  a(href='javascript:;') 马上注册
	            #community.item
	              .info-title
	                h3 社区
	                .hr
	              .information-detail
	                a.other(href='#') 新垣结衣
	                br
	                a.other(href='#') Aragaki Yui
userFunctionServer.js

	var express = require('express');
	var mongoose = require('mongoose');
	var users = require('../schema/schema');
	var app = require('../app');
	var router = express.Router();
	
	var responseData = {
	    code: 0,
	    message: ''
	};
	
	router.post('/register', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var repassword = req.body.repassword;
	
	    if (username === '') {
	        responseData.code = 11;
	        responseData.message = '用户名不能为空';
	        res.json(responseData);
	        res.cookie('userInfo', {
	            errorCode: responseData.code
	        });
	        return;
	    } else if (password === '') {
	        responseData.code = 12;
	        responseData.message = '密码不能为空';
	        res.cookie('userInfo', {
	            errorCode: responseData.code
	        });
	        res.json(responseData);
	        return;
	    } else if (password !== repassword) {
	        responseData.code = 13;
	        responseData.message = '两次密码输入不一致';
	        res.cookie('userInfo', {
	            errorCode: responseData.code
	        });
	        res.json(responseData);
	        return;
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user) {
	                responseData.code  = 14;
	                responseData.message = '用户名已存在';
	                res.cookie('userInfo', {
	                    errorCode: responseData.code
	                });
	                res.json(responseData);
	                return;
	            } else {
	                console.log("ok");
	                var newUser = users({
	                    dbusername: username,
	                    dbpassword: password
	                });
	                newUser.save();
	                responseData.code = 0;
	                responseData.message = '注册成功';
	                res.json(responseData);
	                return;
	            }
	        });
	    }
	});
	
	router.post('/signin', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	
	    if (username === '') {
	        responseData.code = 21;
	        responseData.message = '请输入用户名';
	        res.cookie('userInfo', {
	            errorCode: responseData.code
	        });
	        //console.log('取得的cookie:'+ req.cookies);
	        res.json(responseData);
	        return;
	    } else if (password === '') {
	        responseData.code = 22;
	        responseData.message = '请输入密码';
	        res.cookie('userInfo', {
	            errorCode: responseData.code
	        });
	        res.json(responseData);
	        return;
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user && user.dbpassword === password) {
	                responseData.code  = 0;
	                responseData.message = '登录成功';
	                res.cookie('userInfo', {
	                    username: username,
	                    password: password,
	                    errorCode: responseData.code
	                });
	                res.json(responseData);
	                return;
	            } else {
	                responseData.code = 23;
	                responseData.message = '用户名或密码错误';
	                res.cookie('userInfo', {
	                    errorCode: responseData.code
	                });
	                console.log('取得的cookie:'+ res.cookie.userInfo);
	                res.json(responseData);
	                return;
	            }
	        });
	    }
	});
	
	// 注销
	router.get('/logout', function (req, res) {
	    res.clearCookie('userInfo');
	    res.render('index', {
	        showSignin: true,
	        showRegister: false,
	        showInformation: false
	    });
	});
	
	module.exports = router;
多谢赛。