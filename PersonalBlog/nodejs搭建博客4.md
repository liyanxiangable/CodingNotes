---
title: nodejs搭建博客4
date: 2017-04-20 09:43:33
tags:
---

昨天做到了ajax发送注册登录的功能，并且钦定了有一个userFunctionServer的js模块来对齐进行处理。下面开始做这个后端的功能。

我们发送的请求的url是/userFunctionServer/register或者/userFunctionServer/signin。说以我们对这两个url进行路由，嗯，我们需由路由文件，在routes文件夹新建userFunctionServer.js文件、暴露该模块。并且在app.js文件中加载该模块、作为中间件路由。我们先试一下能否路由成功。
嗯，mongodb报了一个错：connection error: { MongoError: connection 0 to localhost:27017 timed out，重启了数据库又好了。不碍事，继续。我们用的是post，所以在路由中也是用响应post请求。在日志中看到状态为200，表示成功，然后就开始写逻辑。先来写注册的，我们的注册数据以json的格式提交到了服务器，然后在服务器端进行解析，如果成功再把数据放进数据库。

我们已经能够收到post请求，现在就解析json数据。我们之前在app.js中加载过body-parser的一个中间件。现在我们声明并初始化相应的变量。

	router.post('/register', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var repassword = req.body.repassword;
	});
下一步我们要判断这些变量是否合适。比如说，用户名长度与字符是否符合规则，密码长度与字符是否符合规则，用户名是否为空，密码是否为空，两次密码是否一致（当然这些可以在前端完成），是否有不合适的关键字以及用户名是否重复等。我们现在只是初步的检验以下几项：(1)用户名是否为空(2)密码是否为空(3)密码是否一致(4)用户名是否重复。这些逻辑除了第四条需要操作数据库外，都很简单。我们想要给用户返回一个状态码code与状态信息message来表示用户提交的注册数据是否符合要求。mongoose模块具有对数据库查询的函数findOne，只返回单个文档。Declares the query a findOne operation. When executed, the first found document is passed to the callback. 

	Model.findOne({ age: 5}, function (err, doc){
	  // doc 是单个文档
	});
我们利用这个函数，对用户名进行查找，经过了之前的各种检查，现在只有用户名的重复性检查。如果存在着与提交的用户名相同的数据，那么就会返回第一个这样的数据，也就代表着用户名有重复，注册不成功。我们现在为了模块化程序方便管理，将app.js中的定义schema的部分转移到新的单独的schema.js文件，并把它作为模块暴露出来。
userFunctionServer载入这个模块。在这里一开始载入模块写的是

    var schema = require('/schema/schema');
结果报错说找不到模块，后来改成了相对路径。

    var schema = require('../schema/schema');
嗯，接着之前的继续，我们有了schema。现在还缺少model，schema.js中定义一个model。例如

	var users = mongoose.model('users', schema);
我们现在把这个user暴露出去。引入的时候是引入的文件名，而不是暴露的变量或函数。接着写我们的逻辑：

	router.post('/register', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var repassword = req.body.repassword;
	    var code = 0;
	    var message = '注册成功';
	    if (username === '') {
	        code = 1;
	        message = '用户名不能为空';
	    } else if (password === '') {
	        code = 2;
	        message = '密码不能为空';
	    } else if (password !== repassword) {
	        code = 3;
	        message = '两次密码输入不一致';
	    } else {
	        users.findOne({username: username}, function (err, user) {
	            if (user) {
	                code  = 4;
	                message = '用户名已存在';
	            } else {
	                console.log("ok");
	            }
	        });
	        console.log(code + message);
	    }
	});
我们检查过后，如果没有发现问题，那么就可把用户传进来的数据存进数据库。并且返回客户端对用户输入数据的信息，使得在前端能够进行提交数据之后的回调函数。于是我们声明并初始化一个json对象responseData来返回给前端与用户信息，我们利用express的res.json([body])方法来传递给客户端一个json对象。Sends a JSON response. This method is identical to res.send() with an object or array as the parameter. However, you can use it to convert other values to JSON, such as null, and undefined. (although these are technically not valid JSON).我们把传回的这个json应用到提交数据之后的回调函数中，也就变成了success中的result。

    users.findOne({username: username}, function (err, user) {
        if (user) {
            responseData.code  = 4;
            responseData.message = '用户名已存在';
        } else {
            console.log("ok");
        }
接着写前端接收到响应数据的逻辑：

    $register.find('button').on('click', function () {
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
                    window.alert(result.message);
                } else {
                    window.alert(result.message);
                }
            }
        });
    });
然后我们把注册数据添加到数据库中去。对于数据的存储，mongoose给出了save的方法。我们只需要new一个之前定义好的model，再调用save方法就好了。

	var responseData = {
	    code: 0,
	    message: '注册成功'
	};
	
	router.post('/register', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var repassword = req.body.repassword;
	
	    if (username === '') {
	        responseData.code = 1;
	        responseData.message = '用户名不能为空';
	    } else if (password === '') {
	        responseData.code = 2;
	        responseData.message = '密码不能为空';
	    } else if (password !== repassword) {
	        responseData.code = 3;
	        responseData.message = '两次密码输入不一致';
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user) {
	                responseData.code  = 4;
	                responseData.message = '用户名已存在';
	            } else {
	                console.log("ok");
	                var newUser = users({
	                    dbusername: username,
	                    dbpassword: password
	                });
	                newUser.save();
	            }
	        });
	    }
	    res.json(responseData);
	});
我一开始是这么写的，但是发现有个一问题。那就是我们nodejs是异步非阻塞的，现在res.json(responseData)这一句放到了最下面，结果就是还没有执行router.post的回调函数，据开始执行这一句res.json了。所以我们要把这句放到回调函数的几个分支条件中。尽管这样看起来很麻烦，如下：

	router.post('/register', function (req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var repassword = req.body.repassword;
	
	    if (username === '') {
	        responseData.code = 1;
	        responseData.message = '用户名不能为空';
	        res.json(responseData);
	        return;
	    } else if (password === '') {
	        responseData.code = 2;
	        responseData.message = '密码不能为空';
	        res.json(responseData);
	        return;
	    } else if (password !== repassword) {
	        responseData.code = 3;
	        responseData.message = '两次密码输入不一致';
	        res.json(responseData);
	        return;
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user) {
	                responseData.code  = 4;
	                responseData.message = '用户名已存在';
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
同样的道理，我们开始写登陆模块相关代码，所以userFunctionServer目前来说总体的代码如下：

	var express = require('express');
	var mongoose = require('mongoose');
	var users = require('../schema/schema');
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
	        responseData.code = 1;
	        responseData.message = '用户名不能为空';
	        res.json(responseData);
	        return;
	    } else if (password === '') {
	        responseData.code = 2;
	        responseData.message = '密码不能为空';
	        res.json(responseData);
	        return;
	    } else if (password !== repassword) {
	        responseData.code = 3;
	        responseData.message = '两次密码输入不一致';
	        res.json(responseData);
	        return;
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user) {
	                responseData.code  = 4;
	                responseData.message = '用户名已存在';
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
	        responseData.code = 1;
	        responseData.message = '用户名不能为空';
	        res.json(responseData);
	        return;
	    } else if (password === '') {
	        responseData.code = 2;
	        responseData.message = '密码不能为空';
	        res.json(responseData);
	        return;
	    } else {
	        users.findOne({dbusername: username}, function (err, user) {
	            if (user && user.dbpassword === password) {
	                responseData.code  = 0;
	                responseData.message = '登陆成功';
	                res.json(responseData);
	                return;
	            } else {
	                responseData.code = 3;
	                responseData.message = '用户名或密码错误';
	                res.json(responseData);
	                return;
	            }
	        });
	    }
	});
	
	module.exports = router;
最后再加上如果信息有错误的话，那么就刷新页面的功能。前端的js代码到目前为止如下：

	$(function () {
	    var $signin = $('#signin');
	    var $register = $('#register');
	    var $information = $('#information');
	
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
	
	    // 点击登陆按钮登陆
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
	                // 如果登陆成功
	                if (!result.code) {
	                    window.alert(result.message);
	                } else {
	                    // 如果登陆不成功，提示登陆错误信息
	                    window.alert(result.message);
	                }
	                if (!result.code) {
	                    window.location.reload();
	                }
	            }
	        });
	    });
	});
OK，这篇完工。