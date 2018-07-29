---
title: nodejs搭建博客3
date: 2017-04-19 15:41:07
tags:
---

嗯，现在我们的页面把注册、登录与个人信息三个功能全显示了，这显然是不对滴。但是现在还不能管他，因为在修改这里之前我们要先做连接数据库的工作，没有数据库与其信息，我们没法判断登录注册与否。所以下面开始连接数据库。

我们用mongodb，百度说了：MongoDB是一个基于分布式文件存储的数据库。由C++语言编写。旨在为WEB应用提供可扩展的高性能数据存储解决方案。他是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。Mongo最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。我们想用它来对我们的博客进行数据上的支持，首先进行下载安装，然后有个GUI工具Robomongo，也可以用。目前的版本是3.4。

关于数据库与这款mongodb数据库，对于非科班的还是挺抽象的，于是刚才到楼下（我现在令希图书馆四楼的某个角落）借了几本书，嗯，但是短时间看不完。所以这里先直接引用网上的教程或者其他的博客来用。
首先我们要在某个文件夹内存放数据库的数据，现在我在site也就是我们项目的文件夹下创建一个文件夹db用以存放数据。cd到数据库安装目录最深层有mongod.exe的目录里，输入命令行：

	mongod --dbpath=C:\Users\yourname\WebstormProjects\site\db
这里后边的路径是刚才新建db文件夹存放数据的目录。当看到shell中输出最后一行为以下内容时，说明数据库就已经启动了。
![](http://i.imgur.com/VdMwtT5.png)
我们可以看到，数据库的端口在27017，我们去看一下，页面上说It looks like you are trying to access MongoDB over HTTP on the native driver port.也就是说已成功。

现在我们要把nodejs后端服务器与mongodb数据库联系起来，还需要第三方的模块。我们这楼里选用mongoose。对于怎么选npm包，我就是看他的星星多不多，有中文文档就更好了。

	npm install mongoose
安装模块后。The first thing we need to do is include mongoose in our project and open a connection to the test database on our locally running instance of MongoDB.我们要做的第一件事就是将mongoose加载到我们的项目当中来本地测试我们的数据库能否连接。

	// getting-started.js
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');
We now need to get notified if we connect successfully or if a connection error occurs:现在我们应该在连接数据库成功的时候给发出一个信号。

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  // we're connected!
	});
With Mongoose, everything is derived from a Schema. Let's get a reference to it and define our kittens.对于mongoose，所有事物都源于schema集合（单词原意为计划，概括）。以下给出了一个定义schema的例子，由他来规定数组所包含什么信息与信息的类型：
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	
	var blogSchema = new Schema({
	  title:  String,
	  author: String,
	  body:   String,
	  comments: [{ body: String, date: Date }],
	  date: { type: Date, default: Date.now },
	  hidden: Boolean,
	  meta: {
	    votes: Number,
	    favs:  Number
	  }
	});
To use our schema definition, we pass it into mongoose.model(modelName, schema):想要利用刚才定义的schema，可以将其传入mongoose.model函数：

	var Blog = mongoose.model('Blog', blogSchema);
	// ready to go!
We may connect to MongoDB by utilizing the mongoose.connect() method.我们可以使用以下方法在应用中对数据库进行连接。

	mongoose.connect('mongodb://localhost/myapp');
我们在我们应用中添加代码，让应用连接数据库。再申明一个schema，包括用户名、密码、权限等。在对连接进行检测，发送错误或者连接信息：

	mongoose.connect('mongodb://localhost/27017');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	    console.log("connected!");
	});
	var Schema = mongoose.Schema;
	var user = new Schema({
	    username: String,
	    password: String,
    	isAdmin: Boolean
	});
我们定义了schema，包括用户名、密码和管理员权限。那么我们先来让用户注册，用户点击注册按钮开始执行ajax注册程序。我们在index的模板中插入脚本index.js，来处理关于index上的功能。等一下，这里index.js和之前的后端的index.js文件重名了，虽然不影响使用，但还是改个名字吧。插入脚本叫做userFunction.js。我现在想把登陆、注册、信息等功能的pug模板视图做成一个个独立的，然后分别引入不同功能的脚本，但是现在还不太清晰，等总体实现了在这样改吧。

下面用jquery来实现注册、登录等功能。我们填写好信息之后点击按钮进行提交。是利用ajax对服务器进行post请求。我们把填写的数据与其它相关信息包装成一个json来传递。其中有个重要的信息就是url，url表示着我们这个请求将会被后端的哪一个文件所处理。然后我们定义了提交之后的回调函数。包括登陆也是与注册相仿的。所以我们要在后端的某个地方来处理这些请求，感觉有个专门负责登录注册的js文件比较好。就叫他userFunctionServer.js吧。所以说，我们这里的url应该写为/userFunctionServer/register与/userFunctionServer/signin。
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
	                    // 提示注册成功，隐藏注册框，显示登陆框
	                    window.alert(result.message);
	                    $register.hide();
	                    $signin.show();
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
	                /*
	                if (!result.code) {
	                    // 提示登陆成功，隐藏登陆框，显示用户信息栏
	                    window.alert(result.message);
	                    $signin.hide();
	                    $information.show();
	                } else {
	                    // 如果登陆不成功，提示登陆错误信息
	                    window.alert(result.message);
	                }
	                */
	                if (!result.code) {
	                    window.location.reload();
	                }
	            }
	        });
	    });
	});