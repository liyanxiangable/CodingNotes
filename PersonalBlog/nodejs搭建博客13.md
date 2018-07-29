---
title: nodejs搭建博客13
date: 2017-04-28 16:55:25
tags:
---


我们来做下面的功能——用户评论。我们已经做过用户注册于登陆，但是还没什么功能。我在这里让用户具有评论文章的功能，如果我有博客，我可能是不想有用户评论这个功能的，而且这个功能很鸡肋。但是作为学习阶段的一个作品，暂且先加上。
我想是有个评论框，用户发表评论的时候，即记录下用户的账号、发表时间、或者不登录的话记录下ip地址、评论的内容以及评论指向的文章。新建一个mongodb的model表示评论，然后在把这条完整的评论信息放到数据库中，当用户点击文章展开时，把这些指向这篇文章的评论加载出来。哎，实在是没意思。先不做这个了。

感觉还想添加一个相册功能，还有状态功能。算了，把这两个合成一个功能吧，就像微信朋友圈那样。嗯，这个可以。这个的做法是和blog差不多的，但是鉴于状态比较短，所以上传文件多此一举，也不需要有什么排版格式，我就想在线编辑。嗯，应该还是在admin这个页面上，既然这样的话就把用户注册功能先去掉把，就我一个用户就行\\(⌒▽⌒)/。有个状态功能的输入区域，支持表单与图片上传，然后记录相应的信息。在首页进行展示。另外突然想到可以加个背景音乐。另外还有就是对上传文件加以判断。

先来做在admin页面添加表单。这个很简单，就不细说了，下面是pug代码：
	form(enctype='multipart/form-data', action="/upmoments", method="post", name='moments')
	  label 说说:
	  textarea(rows="3" cols="20", name='moods', maxlength=200, required='')
	  br
	  label 选择上传图片:
	  input(type='picture', name='picture', multiple='multiple')
	  input(type='submit', value='发表状态')
然后我们添加前端js脚本，我们把admin.js进行修改与扩充，我们先对之前的代码进行jquery的改写：
犯了一个错误，这里的jquery很多范围的选择器返回的是一个数组（尽管我们知道仅有一个结果），所以说我们在得到返回值之后还应该利用索引取得对象。
然后对于上传图片，我们让他可以上传多张图片，后端的限制设置为9张吧，我也不知道为什么，感觉照片一次太多了显得很不专业。
遇到了新问题，我先把修改的代码贴上：
	$(function () {
	    var form = $('[name="fileform"]')[0];
	    $('#fileupload').on('click', function () {
	        var data = new FormData(form);
	        $.ajax({
	            type: 'POST',
	            url: '/upload/blog',
	            data: data,
	            cache: false,
	            processData: false,
	            contentType: false,
	            success: function () {
	                alert('上传成功');
	            }
	        });
	    });
	});
刚才我做图片上传的时候，觉得应该没什么新东西。但是发现图片还是比较大的，比如说iphone拍出来的照片都有4M左右。这个时候就需要文件以流的形式进行传输。而且，还应该对图片进行压缩。并且还应该压缩成多个版本以供使用，这就有些麻烦了。我把gridfs-stream的文档放到了下面，我就不翻译了。从网上也看到mongodb不太适合存储这种文件，建议用七牛什么的。
我现在按照上传文件的方法将图片上传到了服务器，然后从服务器中取文件而不是用数据库。
	router.post("/picture", pictureUpload.array('picture', 9), function (req, res) {
	    var moods = req.body.moods;
	    var picture = pictures({
	        picture: req.picture,
	        moods: moods
	    });
	    picture.save();
	    res.redirect('/admin');
	});
不存在数据库也不行，因为没有办法表示图片与图片与状态的关系。我该怎么办呢？先放一放吧，时间挺紧，先做一下前端。












[http://www.2cto.com/kf/201310/252063.html](http://www.2cto.com/kf/201310/252063.html)
[https://github.com/aheckmann/gridfs-stream](https://github.com/aheckmann/gridfs-stream)
[https://cnodejs.org/topic/51d249dcd44cbfa3040bd28a](https://cnodejs.org/topic/51d249dcd44cbfa3040bd28a)
[https://www.zhihu.com/question/21150697](https://www.zhihu.com/question/21150697)