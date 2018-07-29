---
title: nodejs搭建博客10
date: 2017-04-25 23:01:13
tags:
---

现在我们已经能够上传文件。我们希望能够解析markdown格式的文件，这样的话。我们只需要设计样式，然后渲染markdown成为html就可以了。我在github上找到了marked等一系列开源项目，好像可以将markdown文件渲染成html。现在就是在想究竟以什么样的方式来处理我们上传上去的博客文档，就像hexo这样的博客工具，我们就是写markdown文档，然后他进行解析。现在来学习一下marked文档：
Minimal usage:
最简使用，就是加载marked模块，然后使用marked函数解析字符串，就会生成相应的html，如图：

	var marked = require('marked');
	console.log(marked('I am using __markdown__.'));
	// Outputs: <p>I am using <strong>markdown</strong>.</p>
![](http://i.imgur.com/hIGqMoX.png)

Example setting options with default values:
下面是一个默认设置的参数配置，这几个参数是干什么用的写到了后边。

	var marked = require('marked');
	marked.setOptions({
	  renderer: new marked.Renderer(),
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: false,
	  smartLists: true,
	  smartypants: false
	});

	console.log(marked('I am using __markdown__.'));
![](http://i.imgur.com/oJo28SG.png)
Browser
对下面的html文件，他的脚本会在content作为id的div里面插入字符串解析成html的内容。结果如下图，我们这里解析的字符串是带有markdown格式的，之后可以试一下对markdown文件进行渲染：

	<!doctype html>
	<html>
	<head>
	  <meta charset="utf-8"/>
	  <title>Marked in the browser</title>
	  <script src="lib/marked.js"></script>
	</head>
	<body>
	  <div id="content"></div>
	  <script>
	    document.getElementById('content').innerHTML =
	      marked('# Marked in browser\n\nRendered by **marked**.');
	  </script>
	</body>
	</html>
![](http://i.imgur.com/AvzHyjq.png)
marked(markdownString [,options] [,callback])
markdownString：Type: string，String of markdown source to be compiled. 
options：Type: objectHash of options. Can also be set using the marked.setOptions method as seen above.
callback：Type: function. Function called when the markdownString has been fully parsed when using async highlighting. If the options argument is omitted, this can be used as the second argument.
然后是marked函数，他有三个参数：第一个是字符串类型的想要编译的markdown；第二个是一个可选的哈希对象，也可以在marked.setOptions中进行设置；最后是回调函数，当字符串被解析完成的时候执行。

Options
highlight
Type: function
选项设置中，highlight是一个函数，它是用来“格式化”代码块的，下面的第一个例子使用了同步的格式化库，第二个例子用的是一步的库，他们的github项目地址我放在最后参考链接里了。
A function to highlight code blocks. The first example below uses async highlighting with node-pygmentize-bundled, and the second is a synchronous example using highlight.js:
	
	var marked = require('marked');
	var markdownString = '```js\n console.log("hello"); \n```';

	// 利用异步格式化
	marked.setOptions({
	  highlight: function (code, lang, callback) {
	    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
	      callback(err, result.toString());
	    });
	  }
	});

	// 同步使用marked函数进行格式化
	marked(markdownString, function (err, content) {
	  if (err) throw err;
	  console.log(content);
	});
	
	// 利用同步格式化代码块
	marked.setOptions({
	  highlight: function (code) {
	    return require('highlight.js').highlightAuto(code).value;
	  }
	});
	console.log(marked(markdownString));
highlight arguments
下面是highlight的参数
1. code
Type: string
The section of code to pass to the highlighter.
code参数是进行编译的代码块的字符串
2. lang
Type: string
The programming language specified in the code block.
lang是在代码块中的语言
3. callback
Type: function
The callback function to call when using an async highlighter.
callback是一个回调函数，执行异步highlight函数时进行此回调

renderer
Type: object Default: new Renderer()
An object containing functions to render tokens to HTML.
renderer是一个对象，可以以new Renderer()的方法生成此对象。他具有将标记渲染成html的函数。
Overriding renderer methods
The renderer option allows you to render tokens in a custom manner. Here is an example of overriding the default heading token rendering by adding an embedded anchor tag like on GitHub:
重写的renderer方法，通过renderer配置可以对原型进行的渲染。下面给出了一个重写默认h标签渲染的例子，就像github页面上嵌入锚标记的那样。

	var marked = require('marked');
	var renderer = new marked.Renderer();
	renderer.heading = function (text, level) {
	  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
	  return '<h' + level + '><a name="' +
	                escapedText +
	                 '" class="anchor" href="#' +
	                 escapedText +
	                 '"><span class="header-link"></span></a>' +
	                  text + '</h' + level + '>';
	},
	console.log(marked('# heading+', { renderer: renderer }));
This code will output the following HTML:

	<h1>
	  <a name="heading-" class="anchor" href="#heading-">
	    <span class="header-link"></span>
	  </a>
	  heading+
	</h1>
下面是renderer对象的几个块级渲染方法

	code(string code, string language)
	blockquote(string quote)
	html(string html)
	heading(string text, number level)
	hr()
	list(string body, boolean ordered)
	listitem(string text)
	paragraph(string text)
	table(string header, string body)
	tablerow(string content)
	tablecell(string content, object flags)
1. gfm
Type: boolean Default: true
Enable GitHub flavored markdown.
gfm为布尔型变量，表示是否可以使用GitHub flavored markdown这个插件.
2. tables
Type: boolean Default: true
Enable GFM tables. This option requires the gfm option to be true.
tables为布尔型变量，表示是否可以使用GFM的tables功能，这个选项要求gfm变量为true
3. breaks
Type: boolean Default: false
Enable GFM line breaks. This option requires the gfm option to be true.
breaks为布尔型变量，表示是否可以使用GFM的line breaks功能，这个选项要求gfm变量为true
4. pedantic
Type: boolean Default: false
Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior.
pedantic为布尔型变量，用来尽可能地确认模糊的markdown片段。但不会修复任何的原有bug与不恰当用法。
5. sanitize
Type: boolean Default: false
Sanitize the output. Ignore any HTML that has been input.
Sanitize为布尔型变量，用来检查输出，会忽略已经输入的任何HTML
6. smartLists
Type: boolean Default: true
Use smarter list behavior than the original markdown. May eventually be default with the old behavior moved into pedantic.
smartLists为布尔型变量，用smarter list用法而不是原生markdown。啥意思？？？
7. smartypants
Type: boolean Default: false
Use "smart" typograhic punctuation for things like quotes and dashes.
smartypants为布尔型变量，使用smart句法标点符号，诸如引号，省略号等。
然后文档说了一大堆我们暂时不关心的，什么marked的哲学，效率超过discount之类的就结束了，官方文档的内容大概就是这样。

回到问题上来，我们究竟怎么把markdown渲染到客户端？我们现在有什么原料呢，有markdown文件一大堆，设定的视图是pug的模板，我们的渲染的页面要连接一些js与css文件，另外有一些附加信息比如说发表时间等也要显示。我们当前的问题与矛盾有如下几点：

1. 我想我们可以在pug渲染的页面中插入html，但是一方面pug模板进行编译才生成html，另一方面我们的markdown也要经过编译生成html（字符串）。
2. 我们把markdown编译成html这个工作是放在前端用js脚本实现呢，还是放在后端用相应模块实现呢？
而且一篇博客的内容比较多，比如说我吧，写到现在为止这篇文章已经有6928个字。我不能把每篇文章就完完整整的摆在那里，太长。要是想看之前的一篇文章，得可劲往后翻。我想把首页或者是博客文章页做成一个一个的小的简介的那种，就像微信公众号一样。比如说我们把文章的前100（打个比方，多少还没定）字作为显示，等游客点进去这篇文章，我们再展开。基于这种需求呢，我是想将markdown文件下载到客户端，然后客户端的js脚本进行解析，再插入到原html框架中。为什么呢，我们每篇文章都有简介，虽然内容信息不多，但是游客能看到东西。假设游客想看《nodejs搭建博客10》这一篇，他点进去了，我们如果在服务器端进行编译再传到客户端，服务器的负载就加重很多，如果有很多人同时访问呢？但是这样，就需要向客户端额外发送merked.js脚本文件，这个文件还不小，未压缩有38kb。但是总而言之，现在把大体思路确定了。

另外在找相应信息的时候，看到了一个程序员的博客，地址放到参考链接里了。感觉挺好看，可以参考他的博客的风格来写样式。
还有之前用过的hexo的一个主题，叫yillia。我把这个主题的项目地址放到参考链接中。另附一个博客，用的是这个主题，以当参考。

参考链接：
[https://github.com/chjj/marked](https://github.com/chjj/marked)
[https://github.com/simbo/gulp-marked](https://github.com/simbo/gulp-marked)
[https://github.com/j201/meta-marked](https://github.com/j201/meta-marked)
[https://github.com/LearnShare/wo-markdown-pages](https://github.com/LearnShare/wo-markdown-pages)
[http://www.tuicool.com/articles/jeaMJrn](http://www.tuicool.com/articles/jeaMJrn)
[https://github.com/rvagg/node-pygmentize-bundled](https://github.com/rvagg/node-pygmentize-bundled)
[https://github.com/isagalaev/highlight.js](https://github.com/isagalaev/highlight.js)
[http://blog.thonatos.com/](http://blog.thonatos.com/)
[http://litten.me/](http://litten.me/)
[https://github.com/litten/hexo-theme-yilia](https://github.com/litten/hexo-theme-yilia)