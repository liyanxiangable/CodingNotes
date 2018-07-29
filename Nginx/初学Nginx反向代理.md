---
title: nodejs项目服务器端部署
date: 2017-06-29 10:01:46
tags:
---


最近想报博客网站放到服务器上，折腾了好几天，总是有错误。还是要认真的看一下运维的内容。
关于Nginx反向代理，就是说用户在进行网站的域名解析的时候，由反向代理将负载均衡的IP返回，而不是服务器本身的IP。所以说反向代理隐藏了服务端，客户端的请求不需要知道服务端是谁，根据服务端的URL请求，请求可以被重定向为其他的location或者server。但是我申请的云主机就只有一个服务器，所以可能感受不到太大作用。
为了对nginx进行实验，需要结合项目的部署，但是在此之前我本身并没有部署成功，并且还要有其他方面的知识，因此可能要花较长的时间来摸索，完成这篇文章。nginx本身复杂强大，这里我不用太深入运维的知识，所以学会基本的内容就好。
首先我先用一个静态项目来实验一下。我在本地新建项目，传到了github，再从服务器将github上的项目clone下来。这个过程不再赘述，参考链接中有github相关简单教程。
静态项目不适用jade模板，而是使用static中间件来讲html文件放在public文件夹中。访问http://127.0.0.1:4000/gakki.html即可获得html的相应。
或者是，接收到请求的时候使用res.senFile来发送html。我觉得这个方法比较好，但是路径比较麻烦：
	  res.sendFile(path.resolve(__dirname, '..') + '/public/gakki.html');
首先关闭nginx，看下在不使用nginx的情况。
	// 查看nginx的进程ID，结果显示root为9620
	ps -ef | grep nginx
	// 杀掉进程以关闭nginx
	sudo kill -QUIT 9620
启动静态项目
	$ npm start
遇到了一个错误：
	Error: listen EADDRINUSE :::4000
这是因为端口被占用了。输入如下命令查看进程，如得到12053
	ps -ax | grep node
杀掉进程：
	kill -9 12053
重新启动，发现收不到请求。考虑可能是防火墙原因。
关闭防火墙：
	sudo ufw disable
还是不行，突然想到我实验的这个项目不是静态项目。。。。。。。
好了，下面写一个真正的静态项目。到底怎样算静态呢？我现在没有使用express框架，而是直接使用nodejs的createServer方法，渲染html，然后成功了。如下：
![](http://i.imgur.com/eYF7Bc2.png)
那我就优点不明白了，为什么用express框架的项目不行？难道是依赖的问题？可是没有报错啊。将查了一下没有报错。
卧槽！我把服务器端口设置成8081之后就可以了，不知道为什么。。。这个先不考虑，将博客项目在8081端口启动，发现能够接受到请求，但是没有响应。在本地打开项目进行对比，发现很有可能是数据库的原因。
## 设置虚拟服务器 ##




参考链接：
1. [https://www.zhihu.com/question/24723688](https://www.zhihu.com/question/24723688)
2. [http://blog.csdn.net/u013870094/article/details/69523535](http://blog.csdn.net/u013870094/article/details/69523535)
3. [http://www.nginx.cn/doc/](http://www.nginx.cn/doc/)
4. [http://nginx.org/en/docs](http://nginx.org/en/docs)
5. [http://www.jianshu.com/p/deb5eddbffb8](http://www.jianshu.com/p/deb5eddbffb8)
6. [http://blog.csdn.net/webnoties/article/details/22797097](http://blog.csdn.net/webnoties/article/details/22797097)
7. [http://blog.sina.com.cn/s/blog_866c5a5d0101ihxv.html](http://blog.sina.com.cn/s/blog_866c5a5d0101ihxv.html)
8. [https://cnodejs.org/topic/50c60035637ffa41550d7a87](https://cnodejs.org/topic/50c60035637ffa41550d7a87)
9. [https://segmentfault.com/q/1010000005964557](https://segmentfault.com/q/1010000005964557)
