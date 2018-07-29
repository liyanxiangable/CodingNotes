---
title: 深入理解nginx 1
date: 2017-07-22 19:15:39
tags:
---

由于之前的跨域问题不能解决，并且在服务器上也需要nginx，所以现在我开始学习一下nginx。主要的参考书籍为以下两本：《精通Nginx》与《深入理解Nginx》，运行环境为ubuntu16.04。目标是对nginx能够理解与基本的运用。一库！


使用包管理器安装nginx，









基本的nginx配置文件由若干个部分组成，每一个部分都是通过下列方法定义的：
	`<section> {
		<directive> <parameters>;
	}`
其中每一个指令行都是由分号结束，这表示一行的结束。大括号表示一个新的上下文。nginx具有全局配置参数，比如：
1. user						配置worker进程的用户和组
2. worker_processes			指定worker进程启动数量
3. error_log				错误写入文件
4. pid						设置记录主进程ID文件
5. use						使用什么样的链接方法
6. worker_connections		工作进程能够接受并发的最大数

在nginx配置文件中，include文件可以在任何地方以增强配置文件的可读性。比如：
	include /opt/local/etc/nginx/mime.types
星号*表示可以匹配多个文件。如果没有给定路径，则nginx将会在主配置文件路径进行搜索。
若要对nginx文件进行语法检查，可以使用如下命令：
nginx -t -c <path-to-nginx.conf>

虚拟server
任何有server关键字开始的部分都被称作为虚拟服务器部分。他描述的是一组根据server_name指令逻辑分割的资源，这些虚拟服务器响应http请求，因此他们都包含在http部分当中。
一个虚拟服务器由listen于server_name指令组合定义。listen指令定义了一个IP地址/端口组合或者是UNIX域套接字路径。
listen address[:port];
listen port;
listen unix:path;

Locations——where, when, how
location指令可以用在虚拟服务器的server部分，这样可以使来自客户端的URL或者重定向访问。

卧槽，《精通nginx》这本书写的跟shi一样，机器翻译的吗？
直接跳到第四章：


反向代理是一个web服务器，他终结了客户端连接，并且生成了另一个新的了连接。新的连接代表客户端上游服务器生成连接。
上游服务器的配置中，对重要的是proxy_pass命令。该指令有一个参数，URL请求将会被转换。带有URI部分的proxy_pass指令将会使用该URI替代request_uri部分。例如下面的例子。在/uri请求传递到上有服务器时会被替换为/newuri。
	location	/uri	{
		proxy_pass http://localhost:8080/newuri
	}
这个规则有两个例外的情况：
1. location定义了正则表达式，那么URI部分不进行替换
2. location中有rewrite改变了URI，那么nginx则使用修改的URI进行请求，不再进行替换
在这两种情况下，proxy_pass指令是与URI不相关的。


多个upstream服务器
可以在upstream中配置将请求传递给多个服务器定义多个server可以参考指令proxy_pass：
	upstream app {
		server 127.0.0.1:9000;	
		server 127.0.0.1:9001;	
		server 127.0.0.1:9002;
	}
	server {
		location / {
			proxy_pass http://app;
		}
	}
这样，nginx将会通过轮询的方式将连续的请求传递给3个上游服务器。


下面我们来试验一下。打开nginx的配置文件nginx.conf。现在我们用到的，主要进行两个地方的修改，分别是server与location。
其中server的端口可以保持为80端口，这个端口是默认的的http开放端口。所以这里当访问一个域名的时候，不用输入端口，那么自动就走80端口。当然你也可以在规定范围内任意设定端口，然后就是server_name，这个就是域名。也就是说，server部分配置的内容就是nginx作为反向代理的地址，当我们对server_name:port进行访问的时候，访问的就是nginx，然后进行代理转发。
下边的一项是location，这里的配置项比较多，现在我们主要关注的只有一个，就是proxy_pass。这一项设置的就是nginx作为server接收到了请求的时候要转发的地址。下面是一颗栗子：

	http {
	    include       mime.types;
	    default_type  application/octet-stream;

	    server {
	        listen       80;	
	        server_name  localhost;		
	
	        proxy_set_header X-Forwarded-For $remote_addr;
	        location / {
	            proxy_pass   https://www.jandan.net/;
	        }

			......
	    }
	}

上边是简化后的配置文件，在某一个http模块中，包含一个server，而这个server中又包含某一个location。现在我们通过配置server的listen与server_name来接收需要代理的请求。上边我们保持了80端口，这样的话在进行访问的时候不用输入端口号就可以默认绝对80端口进行请求。然后为了方便测试，我们将server_name设定为本地服务器。最后在location的匹配反斜线这里，将proxy_pass设置为我们要进行代理请求的地址。
配置完成，保存文件，使用以下命令重启nginx：
	nginx -s reload
现在在浏览器中输入localhost，会发现打开的网页是煎♂蛋。是不是很神奇？现在你可能有个大胆的想法，就是把server_name修改成百度、淘宝等网站。但是人家是不会同意的。你不能随随便便就把别人的域名就代理了。。。


有了以上的简单的基础，我们就可以用它来搞一些事情了。比如说用来ajax的跨域。之前提到过，我想做一个天气应用，但是对于请求的API跨域访问了。现在使用Nginx来解决这个问题的话应当怎么做呢？
我的想法是发起一个同域请求，比如说我现在是在本地，还没有什么域名什么的，那我就对本地的同一端口（项目发布后，有域名的时候就是对同一域名的同一端口）使用nginx进行代理。然后再转发给要进行请求的地址，岂不美哉？

等一下，端口这里好像还有问题。我这里修改以上三项配置之后，访问本地服务器的默认端口总是显示煎♂蛋网。这是怎么回事呢？刚才还可以在80端口随意修改proxy_name。这个等过会我再查一下。

下面我以API请求大连市天气数据的url进行配置：
    server {
        listen       8099;	
        server_name  localhost;		

        proxy_set_header X-Forwarded-For $remote_addr;
        location / {
            proxy_pass  http://aider.meizu.com/app/weather/listWeather?cityIds=101070201;
        }
这样我访问本地服务器的8099端口，就会对大连的天气情况进行请求。以下是返回的数据：
![](http://i.imgur.com/NztAwdv.png)
这样就给我们提供了跨域的思路。只需要修改server，把server_name与listen的端口号设定成与发送ajax请求页面的同域地址，再将对应的proxy_pass设定为原本要进行访问的地址就好了。

所以说接下来的重点就在于url的匹配。
观察要获得天气所请求的url：
	'http://aider.meizu.com/app/weather/listWeather?cityIds=' + city.id
不管是地级市还是区、县级市，请求的url都分为两个部分。前面的那一长串是固定的，只有对吼的cityid有变化。所以在proxy_pass这里，也可以分成两个部分。然后我们给nginx发送请求的时候，也应当包含城市位置的信息，甚至直接是cityid。这样经过我们通配，然后重写url，最终向真正的服务器发送请求并获得数据。
我用的是webstorm本地调试项目的本地服务器，现在在我这里的页面的地址是
	localhost:63342/XXXX/XXXX.html?XXXXX
根据跨域的三个条件：协议、域名（一级二级）、端口只要有一个不相同，两个地址之间就算跨域。现在我只需要符合三个条件都相同就可以使用ajax将请求发送出去。
为了进行测试，现在我在localhost的8888端口创建一个服务器，这个服务器返回一个信息。
修改nginx配置，将proxy_pass改成http://localhost:8888，将listen修改为8888，然后通过测试html文件的进行ajax访问localhost的63342端口。
题外话，然后发现报错：
	XMLHttpRequest cannot load http://localhost:63342/. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
我就纳闷了，怎么还是有跨域的问题？折腾了一会之后想起我由于笔记本电脑没插电，所以没有用webstorm，也就没有使用webstorm打开这个测试项目的html。而是直接右键在浏览器中打开了文件。。。。看来还是得启动webstorm，结果如下：
![](http://i.imgur.com/19bBZ2j.png)
报错：
	GET http://localhost:63342/ 404 (Not Found)
这就很尴尬了，我猜是因为webstorm的本地服务器有保护，只能够调试使用。（）






这样事情就比想象的复杂一点了，我需要自己搭一个小型服务器。代码如下:
	var http = require('http');
	var fs = require('fs');//引入文件读取模块
	var documentRoot = 'C:\\Users\\liyanxiang\\Desktop\\EATS';
	
	var server= http.createServer(function(req,res){
	    var url = req.url;
	    //客户端输入的url，例如如果输入localhost:8888/index.html
	    //那么这里的url == /index.html
	
	    var file = documentRoot + url;
	    console.log(url);
	
	    fs.readFile(file , function(err,data){
	        if (err) {
	            res.writeHeader(404,{
	                'content-type' : 'text/html;charset="utf-8"'
	            });
	            res.write('<h1>404错误</h1><p>页面不存在</p>');
	            res.end();
	        } else {
	            res.writeHeader(200,{
	                'content-type' : 'text/html;charset="utf-8"'
	            });
	            res.write(data);//将index.html显示在客户端
	            res.end();
	        }
	    });
	}).listen(12345);
	
	console.log('服务器开启成功');
好了，现在我们启动这个端口为12345的服务器。并对
	localhost:12345/test.html
进行访问。


再一次地对nginx进行相应配置，捋一下思路。现在要能够通过服务器登上带有ajax请求按钮的页面，同时点击按钮发送的请求必须与本地服务器同域，这也就要求了我们的nginx既能够在请求页面的时候通过或者转发到带有ajax请求按钮的那个页面；又要求当发送特定的ajax请求的时候，能够传递到上游服务器。现在就是想怎么写这样的配置文件。让我看下书：



![](http://i.imgur.com/vyNE8s4.png)
说明可以进行代理。







参考链接：

1. [http://www.cnblogs.com/apexchu/p/4119252.html](http://www.cnblogs.com/apexchu/p/4119252.html "nginx命令")
2. [http://blog.csdn.net/u014420383/article/details/47945819](http://blog.csdn.net/u014420383/article/details/47945819 "node搭建本地服务器")
3. 