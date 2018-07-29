---
title: nodejs搭建博客16
date: 2017-04-29 23:06:32
tags:
---


登陆与注册哪里还没有弄完，因为还需要用cookies来对登陆状态进行保存。可以对之前的做法进行修改。另外还有注销的问题。之前的做法当对页面进行刷新的时候，检查cookies中是否有用户信息，有过有的话，就不显示登陆与注册。按照这个思路我们之前的登陆与注册后的隐藏逻辑就没有必要了。重新看后端相关代码，我们把cookies的相关代码放到了每次都要执行的app.js中的中间件中：
	app.use(function (req, res, next) {
	    // 判断用户权限，合并SendInfo
	    userInfo = {};
	    if (req.cookies.userInfo) {
	        //console.log('欢迎回来，' + req.cookies.userInfo.username);
	        userInfo.username = req.cookies.userInfo.username;
	        userInfo.password = req.cookies.userInfo.password;
	        userInfo.errorCode = req.cookies.userInfo.errorCode;
	    } else {
	        console.log('无用户信息cookies');
	    }
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
	        next();
	    });
	});
以上就是关于判断用户信息与cookies的代码，而写入cookies的代码是在后端登录的代码中：
    res.cookie('userInfo', {
        username: username,
        password: password,
        errorCode: responseData.code
    });
这样我们刷新的时候都会检查用户的登陆状态，可以看到，后端执行渲染的时候，同时发送给客户端一些有用的信息：
    res.render('index', {
	    blogs: blogs,
	    showSignin: app.SendInfo.showSignin,
	    showRegister: app.SendInfo.showRegister,
	    showInformation: app.SendInfo.showInformation,
	    username: app.SendInfo.username,
	    isAdmin: app.SendInfo.isAdmin
	});
这样就可以根据发送的信息来判断登录与注册是否应该显示。但是这样有一个缺陷，就是我们的pug模板是编译成html之后操发送到前端。如果现在有用户信息的cookies，我们的pug代码会根据我们传递的显示的设置把用户信息框的html编译出来，而登录框与注册框就被略过了。这看起来没问题，但是用户在前端就永远不会找到登录框与注册框，比如说用户登陆之后再注销，注销之后是没有办法注册或者登录的。完美解决的方法不太好实现，我是想用户注销的时候，删掉cookies，刷新页面，这个时候应该就能重新显示了。同时我们的页面重新设计了，所以showRegister应该默认为true，并且当有用户信息的时候设置为false。不过要经历一次刷新。
修改pug代码很简单，只需要在相应的登录注册框上添加判断条件：
	if showSignin
但是另外的注销也不好弄，我想用ajax，他给用户带来良好体验的最重要的一点就是不用对页面进行刷新，但是现在我们用的pug模板是编译之后发送到前端，而不进行刷新就不会重新的对pug进行编译。。。总而言之，用pug对ajax感觉有些冲突的地方。就注销这个功能而言，只要是有登陆状态就要让他显示。有没有方法让他与登录功能模块互补出现呢？要是js能够实时监控一个元素就好了。现在先不管用户的管理员身份与用户信息（不考虑ajax对用户信息的获取），我们先让他正常显示注销。