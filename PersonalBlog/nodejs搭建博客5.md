---
title: nodejs搭建博客5
date: 2017-04-20 19:41:28
tags:
---

书接上回，我们做完了登陆与注册的前端、后端与数据库的代码。但是有个问题是，我们的登录框、注册框与信息栏一直全都显示着，现在我们来改进这一点。我们让（1）一打开网页时这三个区域只显示其中的登录框；（2）登录进去只显示信息框；（3）注册框由超链接打开；（4）打开注册框时不显示其他两个区域，当注册提交信息有误时，刷新显示注册框；（5）登录信息有误时，刷新显示登录框。
对于需求（1），我们可以在css样式中让其他两个区域display:none。

	#information {
	    display: none;
	}
	#signin {
	    display:none;
	}
对于需求（2），我们可以在前端登陆代码中，将登录框与注册框隐藏：

	...
	if (!result.code) {
	    // 提示登陆成功，隐藏登陆框，显示用户信息栏
	    window.alert(result.message);
	    $signin.hide();
	    $information.show();
	}
对于需求（3），只需要加入锚元素即可：

    .other
      | 没有账号？
      a(href='javascript:;') 马上注册
对于需求（4）和需求（5），我们可以在提交信息有误时运行刷新的代码那里对这三个区域进行操作：

    ...
	if (!result.code) {
        // 提示登陆成功，隐藏登陆框，显示用户信息栏
        window.alert(result.message);
        $signin.hide();
        $information.show();
        $register.hide();
    } else {
        // 如果登陆不成功，提示登陆错误信息
        window.alert(result.message);
        $signin.show();
        $information.hide();
        $register.hide();
    }
	...
    if (!result.code) {
        // 提示注册成功，隐藏注册框，显示登陆框
        window.alert(result.message + ' ' + result.code);
        $register.hide();
        $signin.show();
        $information.hide();
    } else {
        // 注册不成功，提示注册错误信息
        window.alert(result.message);
        $register.show();
        $information.hide();
        $signin.hide();
    }
讲道理以上的功能应该用jade实现比较好，奈何jade还没入门，先留个坑回头填上。

处理好以上的东西，现在还有一个问题就是我们需要cookies来保持数据。其实之前有一个地方没有做，就是登陆之后的注销那里，我们还没有写逻辑，就是要等到做完了cookies这里，只需要把cookies储存的数据一删除再刷新就好了。注意到我们在app.js中引入的模块有cookie-parser。Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 这个模块可以解析cookie的header并且可以用cookie的名称作为键来对请求的cookies进行操作。可以看文章最下方的相关链接，第一篇文章讲得很详细。现在我们想保持的是登录状态，因为我们现在没有多少东西可以记录，就光一个用户信息，本来登录上的，结果一刷新页面就不在登录了。所以我们在服务器端的userFunctionServer.js这里的登录逻辑中，把数据放入cookies。res.cookie(name, value [, options])，Sets cookie name to value. The value parameter may be a string or object converted to JSON. The options parameter is an object that can have the following properties.给cookie赋名称与值。值可以是字符串或者转成json格式的对象，参数选项如下：

![](http://i.imgur.com/Xpnatfx.png)

    res.cookie('userInfo', {
        username: username,
        password: password
    });
现在我们把用户的信息放入到了cookies中。注意我们的存的时候是放到了res中，利用的是res.cookie的方法。但是在取的时候就是

	req.cookies.userInfo：
    if (user && user.dbpassword === password) {
        res.cookie('userInfo', {
            username: username,
            password: password
        });
        responseData.code  = 0;
        responseData.message = '登录成功';
        console.log('取得的cookie:'+ req.cookies.userInfo);
        console.log('取得的cookie:'+ req.cookies.userInfo.username);
        console.log('取得的cookie:'+ req.cookies.userInfo.password);
        res.json(responseData);
        return;
	}
现在我们确定已经取得了cookies，那么我们想保持登陆状态应当怎么做？根据cookies的特点，我们可以在页面进行刷新的时候让cookies来提供用户的信息。由于我们刚才在写入cookies的时候没有设定cookies的有效期，所以默认浏览器关闭时cookies会被删除。在进行对我们域名的请求时（例如刷新页面），我们首先判断是否有cookies，如果有的话，判断是否有我们用户信息的cookies，有过也存在，那么就是用这个用户信息进行登录。否则就要用户重新填写信息登录。

那么我们应该把这些逻辑写到哪里呢？由于所有的对我们域名的请求都会经过路由。于是我们在需要自定义一个中间件来完成以上的操作。嗯，还应该写在路由代码位置的前边。我们用一个对象来表示用户信息，如果有cookies存储用户信息的话，就把存储的用户信息传给我们定义的用户信息对象。
	app.use(function (req, res, next) {
	    console.log('执行cookies自定义中间件');
	    userInfo = {};
	    if (req.cookies.userInfo) {
	        userInfo.username = req.cookies.userInfo.username;
	        userInfo.password = req.cookies.userInfo.password;
	    }
	    console.log(userInfo);
	    next();
	});
现在我们再重启服务器，登录用户之后，刷新页面，发现我们的控制台输出欢迎回来并且可以输出cookies储存的用户名与密码，说明我们的cookies已经生效了。但是我们发现，如果刷新页面，又是显示登录框而非信息框。所以我们来对显示内容逻辑进行修改。

由于我们已经拥有了cookies也就是用户名与密码，我们此时想让他显示信息框，所以我们把信息栏显示而隐藏登录框的逻辑条件修改为服务器能够找到用户信息。当我们刷新网页时，首先app.js会执行众多的中间件，然后分模块路由到index.js，再从此模块中做出响应，渲染index.jade模板。嗯，之前说过想做成一个一个的内容分块，这里只要执行那些内容分块的模板需要渲染，那些不需要渲染就行了。然而，还没有看这里。于是先用jquery做，我们在响应时，都给客户端回传（暂且定为和之前的格式相同）状态信息与状态码。在客户端根据状态信息与状态码来显示应当被显示的内容。好吧，我承认这样很麻烦而且增加资源的体积，jade这个坑我一定会补上的。这样来说，我们把userFunctionServer.js的responseData这个对象移到app.js里，再利用中间件，把所有的res都添加一个responseData对象。

	app.use(function (req, res, next) {
	    console.log('执行responseData中间件');
	    var responseData = {
	        code: undefined,
	        message: ''
	    };
	    if (req.cookies.userInfo) {
	        responseData.code = 0;
	        responseData.message = '登陆成功';
	        res.json(responseData);
	    }
	    next();
	});
嗯，这里报了个错。Can't set headers after they are sent. 说的很明确，我们不能够同时用res.json与res.render这两个函数，因为底层会调用两次res.end方法。这里其实res.render的第二个参数可以传递参数，但是我理解成了他是向模板传参数，没有深刻地理解。所以修改app.js代码

	...
	app.use(function (req, res, next) {
	    console.log('执行responseData中间件');
	    if (req.cookies.userInfo) {
	        responseData.code = 0;
	        responseData.message = '登陆成功';
	    }
	    next();
	});
我们把app.js在index路由到的模块中加载，来传递获得的responseData数据：

	var app = require('../app');
修改index.js中的渲染代码：

	router.get('/', function(req, res, next) {
	    res.render('index', app.responseData);
	});
现在我们的响应就可以把cookies信息传回客户端。我们下一步要做的就是，每当用户刷新页面时，我们在前端对responseData进行解析，最终来决定哪些内容显示，哪些内容不显示：

等一下，我又发现了一个问题 (OдO`) ，我们如果用前端来判断哪些内容显示哪些内容，那么所有的数据还是由服务器传到了前端，这样很不安全。看来不用jade是不行的，下一篇换jade。

参考链接
[https://segmentfault.com/a/1190000004139342?_ea=504710](https://segmentfault.com/a/1190000004139342?_ea=504710 "express中cookie的使用和cookie-parser的解读")
[https://github.com/expressjs/cookie-parser](https://github.com/expressjs/cookie-parser "cookie-parser")
[http://www.expressjs.com.cn/4x/api.html#res.cookie](http://www.expressjs.com.cn/4x/api.html#res.cookie "express文档res.cookies部分")