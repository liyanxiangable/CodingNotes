---
title: nodejs搭建博客9
date: 2017-04-25 10:19:26
tags:
---

好了，荒废了一上午。也没写代码，也没看书，就给人家帮忙解决问题，完全学不下去。也可能是没有休息好的原因吧，昨天两点多才睡着，三个室友，一个用电脑用到两点；一个看视屏还是怎么着，不时地对剧情进行评论；另一个一直公放手机，一直看视屏，然后终于在一点多的时候放下手机在一分钟之内呼噜打得比拖拉机还响。完全不给我任何睡着的机会啊，现在好像神经衰弱一般。现在都下午一点多了，好歹吃了中心的鸡公煲（好难吃，再也不回去吃了），理理思绪，正式开始。


现在我们还要做什么，当然是往博客上写文章，所以要有编写博客的界面。不过我比较倾向于使用md，将md上传的方法。因为就象现在的这篇文章所写的，md编辑非常方便，并且支持丰富的功能，这一点是在线编写博客所不具有的优点。嗯，我现在还没找到hexo是怎么解析md文件的，也不知道这样的工具是否开源。我想可以先来对txt文件进行上传。因为如果是在不能进行对md的解析的话，在线编辑也不过是txt的编辑，体验也不会更好。

我先把之前的一个坑填平了，就是那两个按钮那里，我没有加链接。本来以为没什么问题，当然其实也没什么问题。但是呢之后的请求路径什么的用到了，也没有仔细弄，结果现在来看这个admin页面有些别扭，如果能放在一页当中，那要这两个按钮指向哪里呢？这就是做东西前没有规划好，走一步算一步，结果走不远。现在来看我想把所有的管理功能（可能会有很多）都放到这一页上吧，然后这些按钮什么的当作页内的一个导航。这样也行，嗯。

那么下面我来给他们加上链接，加完锚记了，这里就不写了，很简单。等之后这个页面写完会有全部的代码。

下面来写我们想要上传文件的区域。首先HTML5有个FormData对象，可以用来进行文件的上传。我们先把MDN上的例子做成小demo，感觉还可以。当然也有一些现成的插件呢可以使用，用插件方便些。关于插件，我把找到的一个还不错插件的详细内容以及出处放到了参考链接中。下面是部分插件的代码。
本想用插件的，现在想想还是用MDN的例子直接写吧。很短，我直接把我的理解写到注释里了：

	<form enctype="multipart/form-data" method="post" name="fileinfo">
    <label>邮箱地址:</label>
    <input type="email" autocomplete="on" autofocus name="userid" placeholder="email" required size="32" maxlength="64" /><br />
    <label>自定义文件标签:</label>
    <input type="text" name="filelabel" size="12" maxlength="32" /><br />
    <label>选择上传文件:</label>
    <input type="file" name="file" required />
    <input type="submit" value="上传文件" />
	</form>
	<div></div>

	// 声明一个变量，他指向文档的表单对象的叫做fileinfo的表单的这个表单(ーー゛)，叫他表单form
	var form = document.forms.namedItem("fileinfo");
	// form来监听一个submit时间，如果监听到此事件，则执行回调函数
	form.addEventListener('submit', function(ev) {
		// 声明一个指向文档中选择div的第一个元素，叫他oOutput
	    var oOutput = document.querySelector("div"),
			创建一个FormData对象，叫他oData。传入构造函数form即我们上传文件的表单
	        oData = new FormData(form);
		对oData调用append方法， append方法会添加一个新值到FormData对象内的一个已存在的键中，如果键不存在则会添加该键。
	    oData.append("CustomField", "This is some extra data");
		// 又声明了一个变量创建XHR对象
	    var oReq = new XMLHttpRequest();
		// 利用oReq来对stash.php这个地址提出post请求
	    oReq.open("POST", "stash.php", true);
		// 当oReq加载完成时，若状态为200，则在oOutput这个div中写Uploaded，否则报错
	    oReq.onload = function(oEvent) {
	        if (oReq.status === 200) {
	            oOutput.innerHTML = "Uploaded!";
	        } else {
	            oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
	        }
	    };
		// oReq向服务器发送oData这个FormData对象
	    oReq.send(oData);
		// 最后阻止默认行为
	    ev.preventDefault();
	}, false);
用以上的代码，我们得到pug。当然了，里边有几句代码是没用的，我们去掉或者对其进行修改。另外我们上传一篇文章都需要记录什么，上传时间、分类、作者（原创/转载）、备注信息什么的。这些中，日期自动加，其他的我们自己填：

	  form(enctype='multipart/form-data', method='post', name='fileinfo')
	    label 备注:
	    input(type='text', autofocus='', name='userid', placeholder='备注', size='32', maxlength='64')
	    br
	    select(name='categories')
	      option(value='随笔') 随笔
	      option(value='技术') 技术
	      option(value='段子') 段子
	      option(value='蛤蛤') 蛤蛤
	    label 加入新的分类:
	    input(type='text', name='categories', size='12', maxlength='32')
	    br
	    label 选择上传文件:
	    input(type='file', name='file', required='')
	    input(type='submit', value='上传文件')
现在我们来让服务器接收文件。我使用的是multer中间件来存放文件，也不知道这个包怎么样。multer的文档有中文版，但是写的很简略让人看不懂。有两篇博客讲的比较详细，我放到了参考链接中，我们按照链接中文章对服务器进行修改。
但是有一点，我在使用之前我们写的前端Ajax请求的时候，却运行不了。只能使用表单的action来提交，具体哪里出错了我没有查，这算是个坑，之后回来填。还有就是要提前创建文件的目录，不然会报错：

	var multer  = require('multer');
	var upload = multer({ dest: 'upload/' });
	app.post("/upload", upload.single('file'), function (req, res) {
	    console.log(req.file);
	    console.log(req.body);
	    res.redirect('/admin');
	});
我们在调用single等方法的时候，注意其中的字符串参数为html重文件input表单的name。现在文件传上去了，我们还要对multer进行成吨的配置。

	var Storage = multer.diskStorage({
	    destination: function (req, file, callback) {
	        callback(null, path.join(__dirname, '/public/blogs'));
	    },
	    filename: function (req, file, callback) {
	        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	    },
	    encoding: 'utf8'
	});

这样我们就看到，在public的blogs目录中有我们的文件了。大功告成！


参考链接：
[https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)
[https://zhidao.baidu.com/question/456419230.html](https://zhidao.baidu.com/question/456419230.html)
[https://www.script-tutorials.com/pure-html5-file-upload/](https://www.script-tutorials.com/pure-html5-file-upload/)
[https://developer.mozilla.org/zh-CN/docs/Web/API/Document/forms](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/forms)
[https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)
[http://developer.51cto.com/art/201703/533475.htm](http://developer.51cto.com/art/201703/533475.htm)
[https://www.codeproject.com/Articles/1160420/Upload-Files-Or-Images-To-Server-Using-Node-JS](https://www.codeproject.com/Articles/1160420/Upload-Files-Or-Images-To-Server-Using-Node-JS)
[http://www.cnblogs.com/chyingp/p/express-multer-file-upload.html](http://www.cnblogs.com/chyingp/p/express-multer-file-upload.html)
[http://blog.csdn.net/devil13th/article/details/50404351](http://blog.csdn.net/devil13th/article/details/50404351)