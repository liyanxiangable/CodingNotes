---
title: nodejs搭建博客2
date: 2017-04-19 11:22:05
tags:
---

书接上回，我们在浏览器中打开localhost:5000或者127.0.0.1:5000，就可以看到默认的网页内容。就是说，我们向本地服务器发送了一个路径为'/'的请求，经过层层的第三方中间件，被匹配路由到了index的js处理模块。index.js中创建了router实例。app.route(path)
![](http://i.imgur.com/ijnjmkQ.png)
![](http://i.imgur.com/2p6cOQI.png)
总之，这里的router接收get请求，当路径为'/'时，响应渲染index模板。这个模板在我们之前设定好的views文件夹。并且传递了一个本地变量给模板。我们把默认的title的值改为'新垣结衣'，那么网页上就会显示'新垣结衣'。
	// pass a local variable to the view
	res.render('user', { name: 'Tobi' }, function(err, html) {
	  // ...
	});
最后暴露出router实例去。
嗯，index大体就是这个样子，users同理。打开本地服务器试一下：

![](http://i.imgur.com/CCKBTBZ.png)
![](http://i.imgur.com/ON9BLNA.png)

下一步我们简单的做一下页面。由于主要是nodejs后端的学习，我就简单的布置一下页面。要有博客文章区，登陆框，注册框，信息简介区等。我们用jade哦不，同pug来编写一下静态页面。pug不是很复杂，但是我也不太会，当然如果有现成的html的话，也可以将它转换成pug类型文件。本文最后有工具网页链接html2jade。
我们先不用考虑页面视图的美观性，我准备到最后再修补这些内容，现在先把主要矛盾解决。
pug模板如下：
	extends layout
	
	block content
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
	            a.navigation(href='#') 柳永
	          li
	            a.navigation(href='#') 晏殊
	          li
	            a.navigation(href='#') 李清照
	    .content
	      .container
	        .row
	          .col-md-8.col-lg-8
	            .item
	              h2.item-title 满庭芳
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
	              h2.item-title 一丛花⑴·初春病起
	              p.item-detail 作者: 时间: 阅读: 评论:
	              p.item-summary
	                | 今年春浅腊侵年⑵，冰雪破春妍⑶。东风有信无人见⑷，露微意、柳际花边。寒夜纵长，孤衾易暖⑸，钟鼓渐清圆⑹。
	                | 朝来初日半衔山，楼阁淡疏烟。游人便作寻芳计⑺，小桃杏、应已争先。衰病少悰⑻，疏慵自放⑺，惟爱日高眠。
	              button.article 阅读全文
	          .col-md-4.col-lg-4
	            #information.item
	              .info-title
	                h3 用户信息
	                .hr
	              .information-detail
	                | 您好，您是管理员
	                br
	                a.other(href='#') 点击此处注销
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
	            #community.item
	              .info-title
	                h3 社区
	                .hr
	              .information-detail
	                a.other(href='#') 新垣结衣
	                br
	                a.other(href='#') Aragaki Yui
样式我就不贴了，也没写几句样式"╮(￣▽￣"")╭"，图片是我随便找的大工的图，显示效果如下，细节我们最后再说好吗。。。
![](http://i.imgur.com/rFXRLfA.png)
关于index.pug，首先有extends layout。根据文档，Pug 支持使用 block 和 extends 关键字进行模板的继承。一个称之为“块”（block）的代码块，可以被子模板覆盖、替换。这个过程是递归的。Pug 的块可以提供一份可选的默认内容，比如 block scripts、block content 和 block foot。
也就是说，我们的index这个模板文件其实是layout这个父文件的一个block模块（模板），在父文件中注册，在我们这个index文件中进行定义，最后插入到layout中。然后我们把css与图片等资源都放进去。注意到我们之前在app.js中有一行代码定义了静态资源的放置位置，所以文件路径从那个定义的路径里写相对的路径就好了。

	app.use(express.static(path.join(__dirname, 'public')));
显然这里的静态资源目录是public文件夹，所以在以后的模板文件中引用css、images或者js文件，就从这个目录开始写路径。比如说layout中的以下资源：

    link(href='/stylesheets/bootstrap.css', rel='stylesheet', type='text/css')
    link(href='/stylesheets/three.css', rel='stylesheet', type='text/css')
    script(type='text/javascript', src='/javascripts/jquery.js')
    script(type='text/javascript', src='/javascripts/bootstrap.js')
    script(type='text/javascript', src='/javascripts/index.js')
我们把默认的style.css去掉，并使用自定义的样式。现在我们成功的加载渲染了一个我们想要的静态页面。
到这里出了一个问题，有个404
![](http://i.imgur.com/1C0ypnv.png)
经过百度，可以这样去除错误，打开bootstrap.css，注意到最后一行是一个注释，

	/*# sourceMappingURL=bootstrap.css.map */
把它删除即可。再来运行，完美！

参考链接：
[https://pugjs.org/zh-cn/api/getting-started.html](https://pugjs.org/zh-cn/api/getting-started.html "jade文档")
[http://html2jade.vida.io/](http://html2jade.vida.io/ "html转jade")
[http://www.html2jade.org/](http://www.html2jade.org/ "另一个html转jade")
