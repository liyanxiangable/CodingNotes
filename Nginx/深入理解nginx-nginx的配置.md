---
title: 深入理解nginx 1
date: 2017-07-24 09:06:35
tags:
---


# nginx配置的通用语法 #

## 块配置项 ##
块配置项由一个块配置项名和一对大括号组成。例如：
	events	{
		......
	}
	http	{
		upstream	backend	{
			server	127.0.0.1:8080;
		}

		gzip	on;
		server	{
			...
			location	/webstatic	{
				gzip	off;
			}
		}
	}
上面代码中的events，http，server，location，upstream等都是块配置项。块配置项之后可以加参数如location，块配置项一定会使用大括号将一系列所属的配置项全都包含进来，表示大括号中的配置项同时生效。

## 配置项的语法格式 ##
最基本的配置项语法格式如下：
	配置项名 配置项1 配置项2 ...;
配置项名与配置项之间、配置项与配置项之间使用空格进行分隔。配置项值可以是多个值，每行配置的结尾以分号结束。如果有配置项需要进行注释，可以在开头添加井号#。配置项的单位大约有以下几种，K或者k（千字节），M或者m（兆字节），ms（毫秒），s（秒），m（分钟），h（小时），d（天），w（周），M（月），y（年）等。

## 在配置中使用变量 ##
有些模块允许在配置中使用变量，使用变量的时候前边加上$符号。

# 使用http核心模块配置一个静态web服务器 #

## 虚拟主机与请求分发 ##
由于IP地址的数量有限，因此经常存在多个主机域名对应于同一个IP地址的情况，这时可以在配置文件中按照server_name（用户请求中的主机域名）并通过server块来定义虚拟主机，每个server块就是一个虚拟主机，他只处理与之相对应的主机域名请求。
1. 监听端口
默认		listen 80;
配置块	server
listen参数决定nginx服务如何监听端口，在listen后可以加端口、IP地址和主机名。
2. 主机名称
默认		server_name "";
配置块	server
server_name之后可以跟多个主机名称，在开始处理一个HTTP请求时，nginx会取出header头中的host，与每个server中的server_name进行匹配，以此决定到底由哪一个server块来处理这个请求。有可能一个Host与多个server块中的server_name都匹配，这时就会根据匹配优先级来选择实际处理的server块。server_name与Host的匹配优先级如下：
1）首先选择所有字符串完全匹配的server_name，如www.testweb.com。
2）其次选择通配符在前面的server_name，如*.testweb.com。
3）再次选择通配符在后面的server_name，如www.testweb.*。
4）最后选择使用正则表达式才匹配的server_name，如~^\.testweb\.com$。
3. location
语法		location [=|~|~*|^~|@]/uri/{...}
配置块	server
1）= 表示把URI作为字符串，以便与参数中的uri做完全匹配。例如：
	location  = / {
	  #只有当用户请求是/时，才会使用该location下的配置
	  …
	}
2）~表示匹配URI时是字母大小写敏感的。
3）~*表示匹配URI时忽略字母大小写问题。
4）^~表示匹配URI时只需要其前半部分与uri参数匹配即可。例如：
	location ^~ /images/ {
	  # 以/images/开始的请求都会匹配上
	  …
	}
5）@表示仅用于Nginx服务内部请求之间的重定向，带有@的location不直接处理用户请求。
当然，在uri参数里是可以用正则表达式的，例如：
	location ~* \.(gif|jpg|jpeg)$ {
	  # 匹配以.gif、.jpg、.jpeg结尾的请求
	  …
	}
注意，location是有顺序的，当一个请求有可能匹配多个location时，实际上这个请求会被第一个location处理。
在以上各种匹配方式中，都只能表达为“如果匹配...则...”。如果需要表达“如果不匹配...则...”，就很难直接做到。有一种解决方法是在最后一个location中使用/作为参数，它会匹配所有的HTTP请求，这样就可以表示如果不能匹配前面的所有location，则由“/”这个location处理。例如：
	location  / {
	  # /可以匹配所有请求
	 …
	}

## 反向代理的基本配置 ##
1. proxy_pass
语法 proxy_pass URL;
配置块	location、if
此配置项将当前请求反向代理到URL参数指定的服务器上，URL可以是主机名或IP地址加端口的形式，例如：
	proxy_pass http://localhost:8000/uri/;
还可以如上节负载均衡中所示，直接使用upstream块，例如：
	upstream backend {
	  …6
	}
	server {
	  location / {
	    proxy_pass  http://backend;
	  }
	}
用户可以把HTTP转换成更安全的HTTPS，例如：
	proxy_pass https://192.168.0.1;
默认情况下反向代理是不会转发请求中的Host头部的。如果需要转发，那么必须加上配置：
	proxy_set_header Host $host;
















