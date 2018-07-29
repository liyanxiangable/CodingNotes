---
title: nodejs搭建博客7
date: 2017-04-22 21:54:41
tags:
---

书接上回，做完了界面显示的逻辑，我们现在需要区分管理员用户与普通用户。管理员用户，也就是我(⌒▽⌒)，可以往博客上发文章，可以管理整个博客，具有区别于普通用户的权限与功能。

我们首先在schema这里新增一个文档的字段dbisAdmin。修改schema.js文件，默认的注册不是管理员：

	schema = new mongoose.Schema({
	    dbusername: String,
	    dbpassword: String,
	    dbisAdmin: {
	        type: Boolean,
	        default: false
	    }
	});
现在我们注册一个管理员用户。之后试验一下，修改index.jade文件来显示我们现在是否是管理员身份。我们的这个信息应当是属于用户信息界面里的，我们之前传入res.render的时候，传入的信息有是一个显示信息的对象，现在我们需要对这个对象进行扩充。现在我们的管理员权限身份信息不应当储存在cookies里，我认为这样做有两个原因，一是管理员身份的账号一旦注销之后，如果存放在cookies之中，cookies还没有被清除，这时我们再进行其他用户的登陆时，就会出现管理上的混乱。二是管理员用户如果在操作过程中需要进行管理权限的操作，例如取消管理权限，这时在cookies中的管理员权限需要进行比较起来更复杂的逻辑。所以基于以上原因，我们现在对index.js中的res.render函数中传入的对象进行修改。并且增加中间件，使得在客户端每一次发送请求都验证用户是否有管理员权限。

我们应当再给res.render函数传入的对象增加用户名、是否有管理员权限这两项内容。

我们在定义视图中间件后边添加中间件，用以获得当前的用户名与管理权限。等一下，注意到我们之前有过一个获得用户信息的中间件，我们可以对此中间件进行修改利用。这样我们传入res.render函数的对象就不只是仅仅对视图的设置，随着现在以及以后可能出现的信息的扩充，而是包含着大量的丰富信息。我们可以把这些发送的信息合并成一个对象命名为SendInfo，这样我们就在之后新建一个中间件，其作用是判断用户权限，合并SendInfo。并且，在app.js中我们将暴露出去的变量由viewSetter修改为SendInfo。

我们这里出现了一个错误，为什么已经找到了用户，但是还没有修改isAdmin呢？

	app.use(function (req, res, next) {
		...
	    mongoUsers.findOne({dbusername: SendInfo.username}, function (err, user) {
	        try {
	            if (user.dbisAdmin) {
	                console.log('查询到用户');
	                SendInfo.isAdmin = true;
	            } else {
	                console.log("不是管理员");
	            }
	        } catch (e) {
	
	        }
	    });
	    console.log(SendInfo);
	    next();
	});
因为这里还是一个异步调用回调函数，我们的回调函数还没有执行对数据的修改，数据就已经发送过去了。可以看一下控制台的输出，就会知道回调函数执行的比较晚：
![](http://i.imgur.com/3LIm9C4.png)
从图片可以看到，查询到用户这句话输出的非常晚。我们需要等待异步函数执行完毕之后再往下进行，可以用promise。当然我们也可以将后续代码放到异步执行的回调函数中。好了，现在已经能够判断用户的权限。我们把信息渲染到index.jade模板。

    if showInformation
      #information.item
        .info-title
          h3 用户信息
          .hr
        .information-detail
          if isAdmin
            | 您好，#{username}，您是管理员
          else
            | 您好，您是普通用户
          br
          a.other(href='/userFunctionServer/logout') 点击此处注销

现在的app.js文件的中间件如下：

	var SendInfo = {
	    showRegister: false,
	    showSignin: true,
	    showInformation: false,
	    username: undefined,
	    isAdmin: false
	};
	...
	app.use(function (req, res, next) {
	    // 判断用户权限，合并SendInfo
	    userInfo = {};
	
	    if (req.cookies.userInfo) {
	        console.log('欢迎回来，' + req.cookies.userInfo.username);
	        userInfo.username = req.cookies.userInfo.username;
	        userInfo.password = req.cookies.userInfo.password;
	        userInfo.errorCode = req.cookies.userInfo.errorCode;
	    } else {
	        console.log('无用户信息cookies');
	    }
	    console.log('正在执行SendInfo中间件');
	    if (userInfo.username) {
	        SendInfo.showSignin = false;
	        SendInfo.showInformation = true;
	        SendInfo.username = userInfo.username;
	    } else if (userInfo.errorCode >= 10 && userInfo.errorCode < 20) {
	        SendInfo.showRegister = true;
	        SendInfo.showSignin = false;
	    }
	    mongoUsers.findOne({dbusername: SendInfo.username}, function (err, user) {
	        try {
	            if (user.dbisAdmin) {
	                console.log('查询到用户');
	                SendInfo.isAdmin = true;
	            } else {
	                console.log("不是管理员");
	            }
	        } catch (e) {}
	        console.log(SendInfo);
	        next();
	    });
	});
另外，我们再改一个地方。我们之前在登陆成功后的回调函数用的是window.location.reload方法来对页面进行刷新，现在有个问题是页面刷新是对当前的url重新做出请求，然而我们想让他渲染index.js，也就是说，我们注销之后的url是/userFunctionServer/logout，所以如果我们这时候点击登陆成功以后，他的请求会是/userFunctionServer/logout，页面也就会出错。所以现在我们把登陆成功之后的回调函数改为：

	window.location.replace('/');
这样就好了。现在我们已经有了用户的权限。现在我们来写管理员的管理页面。
首先呢，我们先写后端的路由，我们对用户的权限进行判断，如果是管理员，才可以进入管理页面。于是我们在app.js中对admin.js的后端模块进行路由：

	var admin = require('./routes/admin');
	app.use('/admin', admin);
然后，与index.js同样的，我们写admin的模块，其实现在先复制一下然后把index改成admin就可以。

	var express = require('express');
	var app = require('../app');
	var router = express.Router();
	
	router.get('/admin', function(req, res, next) {
	    res.render('admin', {
	        showSignin: app.SendInfo.showSignin,
	        showRegister: app.SendInfo.showRegister,
	        showInformation: app.SendInfo.showInformation,
	        username: app.SendInfo.username,
	        isAdmin: app.SendInfo.isAdmin
	    });
	});
	
	module.exports = router;
不过我们还没有写admin页面，而且为了方便调试，我们可以先不写渲染哪里，而是先res.write，来进行简单的展示。

	res.send("这里是管理界面");
我们加上对是否是管理员的判断：

    console.log('判断 ' + app.SendInfo.isAdmin);
    if (app.SendInfo.isAdmin) {
        res.send('这里是管理界面');
    } else {
        res.send('您不是管理员用户');
    }
现在可以分别对未登录状态下，普通用户身份登录以及管理员身份登陆状态对admin进行访问，可以看到现在你已经能够判断是否是管理员。

下面开始写管理界面的jade文件。现在webstorm新建一个jade/pug文件呢，他默认的是pug文件，然而pug与jade好像不能混用。

	extends layout
	
	block content
	  script(type='text/javascript', src='/javascripts/userFunction.js')
	  link(type='text/css', href='/stylesheets/admin.css' rel='stylesheet')
	  .header
	    ul.manage
	      li.backend
	        a 后台管理
	      li.user
	        a 用户管理
	    .btn-group
	      a.btn.btn-default.dropdown-toggle(data-toggle='dropdown') #{username}
	        span.caret
	      ul.dropdown-menu(role='menu')
	        li
	          a(href='#') 退出
	  .hero-unit
	    h1 下午好，新垣结衣
	    p 同样，也可以覆盖一个块并在其中提供一些新的块。如下面的例子所展示的那样，content 块现在暴露出两个新的块 sidebar 和 primary 用来被扩展。当然，它的子模板也可以把整个 content 给覆盖掉。
	    p
	      a.btn.btn-primary.btn-large
	        继续
	    

参考链接：

[https://pugjs.org/zh-cn/language/inheritance.html](https://pugjs.org/zh-cn/language/inheritance.html)
[http://blog.csdn.net/leewokan/article/details/6626774](http://blog.csdn.net/leewokan/article/details/6626774)
[http://v2.bootcss.com/components.html](http://v2.bootcss.com/components.html)