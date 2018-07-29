---
title: nodejs搭建博客1
date: 2017-04-18 15:28:04
tags:
---

初学nodejs，想试着搭建一个博客。还是小白，因为我也是边写边学，过程中也许会有不少错误与疏漏，还请包含与指正。主要需要的东西有nodejs v6.9.4(废话)、express v4.15.0、mongodb v3.4等。

首先呢，利用express创建一个新的项目，我叫他site。可以看到生成的项目包含以下内容。
![](http://i.imgur.com/7kpvJeS.png)
1. 可以看到，public目录适用于存放网页的静态资源，包括各种图片，css样式与javascript脚本等。
2. routers目录是用来存放路由的nodejs后端文件，就是说，我们的服务器收到各种请求之后，我们希望能够模块化的处理各种任务，于是我们把不同页面的请求所要完成的工作通过路由放到了这个文件夹的各个js文件中。
3. 下面还有一个views目录，顾名思义就是视图啊、呈现内容等这样一个文件夹，这是用来存放我们网站的各个网页的html文档，或者是一些其他的模板比如说ejs、pug等。当然可以看到我们这里边都是些jade扩展名文件，这个jade已经改名为pug了，express框架里还没有改，这个问题之后再解决。
4. 然后还有一个app.js文件，这个就是我们的创建服务器的文件。由他来引入各种模块，创建服务器、进行路由、处理请求并做出响应。
5. 最后是package.json文件，它是用来描述我们的整个项目，包括项目名称、版本号、依赖资源等。这个文件无所谓，我们几乎(可以做到)用不到他。

然后看app.js文件的默认代码：

	var express = require('express');
	var path = require('path');
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	
	var index = require('./routes/index');
	var users = require('./routes/users');
	
	var app = express();
	
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.use('/', index);
	app.use('/users', users);
	
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});
	
	// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});
	
	module.exports = app;

其中学习与解释一下path模块，这是node自带的模块。The path module provides utilities for working with file and directory paths.文档说这个模块提供了操作文件路径与目录路径的工具、功能。
但是在windows于在posix上又有不同，为了统一，我们可以使用win32来讲posix输出windows风格的路径或者相反：
	path.win32.basename('C:\\temp\\myfile.html');
	// Returns: 'myfile.html'
	
	path.posix.basename('/tmp/myfile.html');
	// Returns: 'myfile.html'
后边还有一大堆api文档，在这里讲不完，我决定以后遇到哪几个api的时候再来介绍。
然后有serve-favicon，这个用原来处理客户端的favicon请求的中间件。
morgan是用来记录信息自动填写日志用的，来辅助我们调试等。
cookie-parser：Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 也就是说，它是用来解析cookie的头信息并且可以用cookie名作为键来处理操作服务器响应的cookies。
body-parser：Parse incoming request bodies in a middleware before your handlers, available under the req.body property.此模块可以在你处理之前以中间件的方式把传递过来的请求的进行解析。
随后载入了两个内部模块，分别是想要路由过去的的index与users。

然后正文开始了，首先创建了一个express实例。利用的是express模块暴露出来的构造函数。
紧接着的两行是对模板引擎进行设置。
	app.set(name, value)
Assigns setting name to value, where name is one of the properties from the app settings table.
翻译一下：将应用配置中的各种属性之一的name的值设置成value。那么都有那些属性配置呢？官方文档上的表格给了一大堆，我们主要看我们设置的两个name，views与views engine。
![](http://i.imgur.com/k8msvkZ.png)
可以看到，views的value是一个或者一组我们应用的视图的路径(这地方怎么翻译view才好？)，views engine的value是之后默认可以省略的视图模版扩展名。所以通过以上两行代码，我们设置了服务器应用应该从哪里找视图模板，与之后我们用到模板时的可省略的扩展名。

然后是一大堆use中间件：
	app.use([path,] callback [, callback...])
Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
为特定的路径指定的中间件方法或者一些函数，指定的中间件函数在预设的路径与请求的路径相匹配时就会执行。下面详细地看每一个use方法。

1. 首先use了favicon(path.join(__dirname, 'public', 'favicon.ico'))
其中favicon(path, options)，Create new middleware to serve a favicon from the given path to a favicon file.是用来创建一个中间件来给为给出的路径提供一个favicon文件。我们这里的路径就是括号里那个字符串。根据nodejs文档，path.join()方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。在任何模块文件内部，可以使用__dirname变量获取当前模块文件所在目录的完整绝对路径。当然这也是一个套路，文档上就是这么写的，所有人也都是这么写的。通过这个中间件就可以响应favicon的请求。
2. 第二个use是logger('dev')，logger是我们载入的morgan模块。通过其文档可知，我们可以传进去一个预定义好的字符串来对日志进行格式化。预定义的字符串也有不少，这里传入的dev是这么说的：Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
	:method :url :status :response-time ms - :res[content-length]
为开发提供简明的日志输出，并根据不同的响应状态来（改变字符的）颜色。服务器错误状态变红色，客户端错误变黄色，重定向状态变青色，其他的状态码不加颜色。
3. 第三个use是bodyParser.json()，Returns middleware that only parses json. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.用于解析客户端请求的body中的内容。
4. bodyParser.urlencoded({ extended: false })，Returns middleware that only parses urlencoded bodies. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).所以这个中间件应该放在json之后，是个解析body中url成为一个数组的。
5. 然后是cookieParser(secret, options)，secret a string or array used for signing cookies. This is optional and if not specified, will not parse signed cookies. If a string is provided, this is used as the secret. If an array is provided, an attempt will be made to unsign the cookie with each secret in order.
options an object that is passed to cookie.parse as the second option. See cookie for more information.
用字符串或数组对cookies进行签署（？），参数可选并且若没有此参数则不对cookies进行签署。这里不太懂，回头再学一下cookies。
6. express.static(path.join(__dirname, 'public'))，This is the only built-in middleware function in Express. It serves static files and is based on serve-static.
The root argument refers to the root directory from which the static assets are to be served. The file to serve will be determined by combining req.url with the provided root directory. When a file is not found, instead of sending a 404 response, this module will instead call next() to move on to the next middleware, allowing for stacking and fall-backs.配置静态资源，当找不到文件时，执行next函数。
7. 然后的两句就是自定义的函数中间件，之前我们说想要模块化，当请求的url为'/'时，就会路由到index.js去处理，当能够匹配到'/users'时，就会路由到users.js处理。
8. 最后是错误中间件，There are special cases of "error-handling" middleware. There are middleware where the function takes exactly 4 arguments. When a middleware passes an error to next, the app will proceed to look for the error middleware that was declared after that middleware and invoke it, skipping any error middleware above that middleware and any non-error middleware below.错误中间件需要4个参数，当一个中间件将一个错误传递到next函数中，应用就会进行检查下一个声明的错误中间件并且启用这个错误中间件，忽略在他之前的所有常规的中间件与在他之后的所有错误中间件。在看我们这两个中间件，首先他在普通中间件中创建了一个error，错误的状态码为404，传入next使其被错误中间件捕捉。下面的错误中间件，将错误消息给了res.locals.message。这个res.locals是An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.然后req.app，文档解释This property holds a reference to the instance of the express application that is using the middleware.
If you follow the pattern in which you create a module that just exports a middleware in order for requiring it in your main file, then the middleware can access the express instance via req.app。大体上说，这个函数为开发环境下的错误处理器，可以将错误信息渲染error模版并显示到浏览器中。
最最后一行，是将app作为模块暴露出去。
最最最后，默认的app并没有监听端口，为了方便开发，我们添加监听端口：
	app.listen(5000);



参考链接：
[http://www.expressjs.com.cn/4x/api.html](http://www.expressjs.com.cn/4x/api.html "express文档")
[https://www.npmjs.com/package/connect](https://www.npmjs.com/package/connect "connec文档")
[http://nodejs.cn/api/http.html](http://nodejs.cn/api/http.html "nodejs文档")

