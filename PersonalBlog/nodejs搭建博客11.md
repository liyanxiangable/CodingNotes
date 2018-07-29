---
title: nodejs搭建博客11
date: 2017-04-26 17:08:35
tags:
---

继续开工，我们首先要做的是把文件传给客户端。这里的文件并不是真正的文件，而是返回markdown格式的字符串到客户端。要想这么做，我们就要先解决markdown文件上传之后我们放在哪。显然是放在数据库比较好。我们新建一个upload.js文件，用来处理对'/upload'的请求，具体的模块路有什么就不说了，之前都做过。奥对了，报了一个错，我们的文件储存路径需要改一下，对于我是'C:/Users/liyanxiang/WebstormProjects/site/public/blogs'。完成之后我们还有几个目标：
1. 我们想要把markdown文件的文本内容全都拿出来，放到数据库中
2. 从数据库中拿出文本内容
3. 将拿出的内容发送给客户端
4. 编写客户端js，使其能够解析markdown。并根据用户行为解析插入html
5. 扩展题，我们要能显示摘要，时间，题目等信息，之后再说
6. 扩展题，我们的表单上传的时候有分类与标签的，我们稍后再实现他

下面解决目标1：
放到数据库，首先我们利用nodejs中的FileSystem模块中的fs.read(fd, buffer, offset, length, position, callback)函数。执行函数可以从fd指定的文件中读取数据。buffer 是数据将被写入到的 buffer。offset 是 buffer 中开始写入的偏移量。length 是一个整数，指定要读取的字节数。position 是一个整数，指定从文件中开始读取的位置。 如果 position 为 null，则数据从当前文件位置开始读取。回调有三个参数 (err, bytesRead, buffer)。等一下，有个更加适合的函数符合我们的需求。readFile即函数。fs.readFile(file[, options], callback)，他有三个参数：file <String> | <Buffer> | <Integer> 文件名或文件描述符，options <Object> | <String>，其中encoding <String> | <Null> 默认 = null，flag <String> 默认 = 'r'，callback <Function>异步的读取一个文件的全部内容。
然后我们存放了这个文件，就来调用这个函数。所以我们从回调函数中进行读取，这里的file参数有点问题，我只能使用绝对路径，用相对路径就找不到。。。。那就老老实实先用绝对路径把。我们把内容打印出来测试一下：
	router.post("/", upload.single('file'), function (req, res) {
	    var absolutePath = 'C:\\Users\\liyanxiang\\WebstormProjects\\site\\public\\blogs\\';
	    fs.readFile( absolutePath+ req.file.filename, function (err, data) {
	        console.log('领导讲话：' + data);
	    });
	    res.redirect('/admin');
	});
控制台上已经输出了我们的领导讲话，表示成功了。下面就是把data写入数据库。我先吃晚饭，过会再写。
吃完了，继续。尽管之前已经做过了用户注册等mongodb的一些操作，但还是想再看一下关于schema与model。Schema用来定义数据结构，而Model是对应Schema的编译版本，一个model的实例直接映射为数据库中的一个文档。
由于我们有新的这种博客文章“数据结构”，所以我在schema文件夹中新建一个schema，同时给之前的schema换一个名字，叫user吧。我们定义一个blog的schema并且设置文档可以包含的字段，包括content, date, category什么的；
	var mongoose = require('mongoose');
	user = new mongoose.Schema({
	    content: String,
	    date: String,
	    category: String
	});
	module.exports = mongoose.model('blogs', user);
然后的过程其实和之前用户的那些差不多，我们从上传文件的回调函数里对model进行实例化。其中，设置时间这里可能有坑，因为toLocaleString方法在我电脑上不是显示的本地时间，这个要测试一下。另外还有个分类，我们注意到表单的提交中，有个body，他含有客户端发送的信息：Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as body-parser and multer. 然后我们发现他是个对象，我们已经知道他的键，那么就可以知道他的值。他的键就是我们html表单之中input提交的属性当中的name。然后我们这里其实是有两个分类表单的，因为我们有默认的分类，如果默认的分类不能满足，则可以新建分类。所以传过来的是一个长度为2的数组。我们对其取值，又新增的分类就用新增的分类，没有新增的分类就用默认的。那么现在的readFile函数为：
    fs.readFile( absolutePath+ req.file.filename, function (err, data) {
        console.log('领导讲话：' + data);
        var myDate = new Date();
        myDate.toLocaleString();
        var categories = req.body.categories;
        console.log(categories);
        var category = undefined;
        if (categories[1]) {
            category = categories[1];
        } else {
            category = categories[0];
        }
        var blog = blogs({
            content: data,
            date: myDate,
            category: category,
            remark: req.body.remark
        });
        blog.save();
    });
我们来试一下，可以看到mongodb中已经有我们的博客内容了。
![](http://i.imgur.com/AuwAbAm.png)

下面解决目标2、3：
从数据库中拿出要解析的文本内容。我们新建一个请求，我们获得这个请求来返回给客户端markdown文本。另外有个事就是我们有很多博客，我们在点开一篇的时候，该怎么告诉服务器游客想要看哪一篇呢？一是把以文章的题目或者其他的值为键，二是用哈希表。鉴于我这个人虽然又帅又勤奋，但是文章也写不了多少。所以暂时先利用文章的标题为键来寻找，我们还没写前端页面，所以先指定一个键来代替。这样我们的数据库这里还要新增一个文章名字段。我们重新添加多个文章，然后进行测试。如下：
	router.get('/', function(req, res, next) {
	    var title =  'file_1493219380823_nodejs搭建博客4.md';
	    blogs.findOne({
	        title: title
	    },function (err, blog) {
	        console.log(blog);
	        console.log('看看这里有东西吗' + blog.content);
	        res.send(blog.content);
	    });
	});
我们可以看到页面是酱婶地：
![](http://i.imgur.com/uSW4wtr.png)
OK

下面解决目标4：
编写客户端js，使其能够解析markdown。并根据用户行为解析插入html
这个没什么好说的，我们先新建一个pug文件，让取得的数据在前段进行解析。欸？好像不行！渲染不出来。可能是我对pug还没有深刻理解吧。
然后在忙了半天怎么把jade中添加markdown编译的html后，我发现pug本身就资词markdown的插入呵呵呵呵。走了一大圈弯路。那就用pug自带的吧，另外还想吐槽下pug的文档写的太简略。。。
我是这样做的，首先安装jstransformer-markdown-it，然后的事情就很简单了。下面是pug代码：
	extends layout
	block content
	  script(type='text/javascript', src='/javascripts/marked.js')
	  .content
	    include:markdown-it file_1493219380823_nodejs搭建博客4.md
但是这样的话，我们是直接把一个markdown文件传进去了。不是不可以，但是这样不利于我们之后的进行，我还是想从数据库中获得文本，再解析。我们先解析pug的框架，把它发到客户端，这时候有html文档的框架。同时我们把markdown文本解析成html作为变量也传回客户端。然后在客户端中插入html框架。我们需要安装依赖markdown。我们为了方便，把blog页面加入按钮，让他来对博客进行请求。这样我们就成功了，附下各文件的代码：
作为blog页面的前端脚本blog.js：
	$(function () {
	    $('#blogTest').on('click', function () {
	        $.ajax({
	            type: 'GET',
	            url: '/blog/show',
	            dataType: 'json',
	            success: function (insertText) {
	                console.log(insertText.text);
	                document.getElementById("content").innerHTML = insertText.text;
	            },
	            error: function () {
	                window.alert('未接受数据');
	            }
	        });
	    });
	});
blog页面的pug文件：
	extends layout
	
	block content
	  script(type='text/javascript', src='/javascripts/blog.js')
	  p 我能显示
	  button.btn#blogTest
	    a(href='#') blog
	  #content
服务器端的处理文件：
	var express = require('express');
	var mongoose = require('mongoose');
	var markdown = require('markdown').markdown;
	var blogs = require('../schema/blog');
	var router = express.Router();
	
	router.get('/', function (req, res, next) {
	    res.render('blog');
	});
	
	router.get('/show', function (req, res, next) {
	    var title = 'file_1493219380823_nodejs搭建博客4.md';
	    blogs.findOne({
	        title: title
	    }, function (err, blog) {
	        console.log(blog);
	        console.log('看看这里有东西吗' + blog.content);
	        var HTMLContent = markdown.toHTML(blog.content);
	        console.log(HTMLContent);
	        res.json({
	            text: HTMLContent
	        });
	    });
	});
	
	module.exports = router;
我们来看一下结果：
![](http://i.imgur.com/RL1t3Ik.png)
现在我们已经实现了基本的功能，至于目标4, 5等之后再来完善。



参考链接：
[https://cnodejs.org/topic/54d97e6d1e6a327207e0975c](https://cnodejs.org/topic/54d97e6d1e6a327207e0975c)
[http://www.nodeclass.com/api/mongoose.html](http://www.nodeclass.com/api/mongoose.html)
[http://blog.csdn.net/sodino/article/details/51590263](http://blog.csdn.net/sodino/article/details/51590263)
[http://www.cnblogs.com/edwardstudy/p/4092317.html](http://www.cnblogs.com/edwardstudy/p/4092317.html)
[http://www.expressjs.com.cn/4x/api.html#req.body](http://www.expressjs.com.cn/4x/api.html#req.body)
[https://cnodejs.org/topic/5368adc5cf738dd6090060f2](https://cnodejs.org/topic/5368adc5cf738dd6090060f2)
[https://segmentfault.com/q/1010000000641904](https://segmentfault.com/q/1010000000641904)
[https://cnodejs.org/topic/56726ccac096b56a0c1b42b3](https://cnodejs.org/topic/56726ccac096b56a0c1b42b3)
[https://github.com/evilstreak/markdown-js](https://github.com/evilstreak/markdown-js)
[http://www.w3school.com.cn/jsref/jsref_events.asp](http://www.w3school.com.cn/jsref/jsref_events.asp)
[http://www.w3school.com.cn/jquery/ajax_ajax.asp](http://www.w3school.com.cn/jquery/ajax_ajax.asp)